/* eslint-disable */
/* global WebImporter */

/**
 * Parser for search-keyword.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selectors: [id$='_phSearchArea'] (council meeting keyword search),
 *   .importedBylaws > .greyBackground (bylaw search by keyword + by number),
 *   per-page roots: the Bylaws GO <button>, Recollect address search (.rCsearch).
 * Model: search-keyword (key-value block; classes: "" | rounded | blue-2 | wide)
 *   { label, placeholder, button, action, param }.
 * Rows are [key, value] with the model field name as key; only rows with a value.
 *
 * Variants:
 *  - rounded: Recollect address search (.rCsearch / Bootstrap .form-control input)
 *  - blue-2: bylaw "BY KEYWORD" search (its GO button sits directly in .greyBackground)
 *  - wide: site search (/Search page: .filterHeader holding the ddlSearchTarget scope select +
 *    #txtSearch), a wide box with the button beside it. The site search gets
 *    param "searchTerm", the parameter the header search submits to /search, so the box shows the
 *    header's query; its hidden scope select is dropped (no server-side search on EDS).
 * A .greyBackground root holding both bylaw searches yields two blocks.
 * Submit targets are JavaScript handlers on the source, so no action row is emitted.
 */

const TEXT_INPUT = 'input[type="text"], input[type="search"], input:not([type])';
const BUTTON = 'button, a.button, a.btn, #btnGo, input[type="submit"], input[type="button"]';

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

// Site search page (search-results template): .filterHeader with the search scope select.
function isSiteSearch(input) {
  const box = input.closest('.filterHeader');
  return Boolean(box && box.querySelector('select[id$="ddlSearchTarget"]'));
}

function paramFor(input) {
  // Same parameter as the header search, so the header's query fills the box.
  if (isSiteSearch(input)) return 'searchTerm';
  const id = `${input.getAttribute('id') || ''} ${input.getAttribute('name') || ''}`;
  if (/number/i.test(id)) return 'number';
  if (/keyword/i.test(id)) return 'keyword';
  return '';
}

function rowsFor(unit) {
  const rows = [];
  const add = (k, v) => { if (v) rows.push([k, v]); };
  const { input, button, label } = unit;
  add('label', clean(label));
  const param = input ? paramFor(input) : '';
  let placeholder = input ? clean(input.getAttribute('placeholder')) : '';
  if (!placeholder && input && input.classList.contains('watermark') && param !== 'number') {
    placeholder = 'Type in keyword(s) here';
  }
  add('placeholder', placeholder);
  const btnText = button ? clean(button.textContent) || clean(button.getAttribute('value')) : '';
  add('button', btnText || 'GO');
  add('param', param);
  return rows;
}

// Label elements found outside the parsed root: their text moves into the block, so they are
// removed from the page afterwards (otherwise "BY KEYWORD" shows twice).
const usedOutsideLabels = new Set();

function precedingLabel(node, root, parsedRoot) {
  // Nearest preceding <strong>/<span>/<label> sibling text (walking up to root).
  let cur = node;
  while (cur && cur !== root) {
    let sib = cur.previousElementSibling;
    while (sib) {
      if (/^(STRONG|B|LABEL|SPAN|H[1-6])$/.test(sib.tagName) && clean(sib.textContent)) {
        if (parsedRoot && !parsedRoot.contains(sib)) usedOutsideLabels.add(sib);
        return clean(sib.textContent);
      }
      sib = sib.previousElementSibling;
    }
    cur = cur.parentElement;
  }
  return '';
}

function makeBlock(document, unit) {
  const name = unit.variant ? `search-keyword (${unit.variant})` : 'search-keyword';
  return WebImporter.Blocks.createBlock(document, { name, cells: rowsFor(unit) });
}

export default function parse(element, { document }) {
  const units = [];

  if (element.matches('button, a.button, input[type="button"], input[type="submit"]')) {
    // Root is the bylaw GO button: its input and label are preceding siblings.
    let input = null;
    let sib = element.previousElementSibling;
    while (sib && !input) {
      if (sib.matches(TEXT_INPUT)) input = sib;
      sib = sib.previousElementSibling;
    }
    units.push({ input, button: element, label: precedingLabel(input || element, element.parentElement, element), variant: 'blue-2' });
  } else {
    const inputs = Array.from(element.querySelectorAll(TEXT_INPUT));
    const grey = element.matches('.greyBackground') || element.closest('.greyBackground');
    inputs.forEach((input) => {
      // Button: next button within the input's parent (fallback: first in root).
      let button = null;
      let sib = input.nextElementSibling;
      while (sib && !button) {
        if (sib.matches(BUTTON)) button = sib;
        sib = sib.nextElementSibling;
      }
      if (!button) button = input.parentElement.querySelector(BUTTON) || element.querySelector(BUTTON);
      let variant = null;
      if (element.matches('.rCsearch') || element.querySelector('.rCsearch') || element.closest('.rCsearch')
        || input.classList.contains('form-control')) {
        variant = 'rounded';
      } else if (isSiteSearch(input)) {
        variant = 'wide';
      } else if (grey && button && button.parentElement && button.parentElement.matches('.greyBackground')) {
        variant = 'blue-2';
      }
      const label = precedingLabel(input, element.parentElement, element) || clean((element.querySelector(':scope > span, :scope > strong') || {}).textContent);
      units.push({ input, button, label, variant });
    });
  }

  if (!units.length) {
    // No search input (e.g. a checkbox list mis-mapped from a signup form): not a search.
    return;
  }

  const blocks = units.map((unit) => makeBlock(document, unit));
  blocks.slice(0, -1).forEach((b) => element.before(b));
  element.replaceWith(blocks[blocks.length - 1]);
  usedOutsideLabels.forEach((labelEl) => { if (labelEl.isConnected) labelEl.remove(); });
  usedOutsideLabels.clear();
}
