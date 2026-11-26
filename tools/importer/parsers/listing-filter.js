/* eslint-disable */
/* global WebImporter */

/**
 * Parser for listing-filter.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selector: div.filterHeader
 * Model: listing-filter (key-value block) { selectName, selectPlaceholder, selectOptions,
 *   keywordName, keywordPlaceholder, button, action }.
 * Rows are [key, value]; the key is the model field name (key-value blocks carry no
 * field-hint comments). Only rows with a value are emitted.
 *
 * - Dropdown: first visible <select>; hidden selects (display:none) are script-driven.
 * - The leading prompt option ("Year", "Category", empty value) becomes the placeholder.
 * - Options become a list of "Label | value" (value dropped when it equals the label
 *   or is a Sitecore item GUID, which has no meaning on the new site).
 * - Keyword box present -> keywordName "keyword" with the watermark placeholder.
 */

const GUID = /^\{?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}?$/i;
const PROMPT = /^(year|category|status|type|month|select.*|all)$/i;

function paramName(select) {
  const raw = (select.getAttribute('id') || select.getAttribute('name') || '').split(/[_$]/).pop();
  let name = raw.replace(/^(ddl|dd|dwn|drp|sel)/i, '');
  name = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  if (/categories$/.test(name)) name = 'category';
  else if (/years?$/.test(name)) name = 'year';
  else if (/status$/.test(name)) name = 'status';
  else name = name.replace(/s$/, '');
  return name || 'category';
}

// News Room search pages: the source search is script-driven (results load by AJAX), so it becomes
// a news-search block, which searches the news query index. The scraped results are dropped.
const NEWS_SEARCH_PAGES = {
  '/city-hall/news-room': '',
  '/city-hall/news-room/news-releases': '/city-hall/news-room/news-releases',
};

function pagePath(url, params) {
  try {
    return new URL((params && params.originalURL) || url, 'https://www.cnv.org').pathname.replace(/\/+$/, '').toLowerCase();
  } catch (e) {
    return '';
  }
}

function field(document, name, value) {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(` field:${name} `));
  frag.appendChild(document.createTextNode(String(value)));
  return frag;
}

function newsSearch(element, document, folder) {
  // the instance selector can match the inner form row: replace the whole filter header (with its
  // help line, which the block renders) and drop the scraped AJAX results anywhere on the page
  const header = element.closest('.filterHeader') || element;
  document.querySelectorAll('#filterResults').forEach((n) => n.remove());
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'news-search',
    cells: [[folder ? field(document, 'folder', folder) : ''], [field(document, 'pageSize', 10)]],
  });
  header.replaceWith(block);
}

export default function parse(element, { document, url, params }) {
  const path = pagePath(url, params);
  if (Object.prototype.hasOwnProperty.call(NEWS_SEARCH_PAGES, path)) {
    newsSearch(element, document, NEWS_SEARCH_PAGES[path]);
    return;
  }
  const selects = Array.from(element.querySelectorAll('select'));
  const select = selects.find((s) => !/display\s*:\s*none/i.test(s.getAttribute('style') || '')) || selects[0];

  const rows = [];
  const addRow = (key, value) => {
    if (value === null || value === undefined || value === '') return;
    rows.push([key, value]);
  };

  if (select) {
    const options = Array.from(select.querySelectorAll('option'));
    let placeholder = '';
    const first = options[0];
    if (first) {
      const text = first.textContent.trim();
      const value = (first.getAttribute('value') || '').trim();
      if (!value || (PROMPT.test(text) && (GUID.test(value) || value.toLowerCase() !== text.toLowerCase()))) {
        placeholder = text;
        options.shift();
      }
    }

    const ul = document.createElement('ul');
    options.forEach((opt) => {
      const label = opt.textContent.replace(/\s+/g, ' ').trim();
      if (!label) return;
      const value = (opt.getAttribute('value') || '').trim();
      const li = document.createElement('li');
      li.textContent = (!value || value === label || GUID.test(value)) ? label : `${label} | ${value}`;
      ul.append(li);
    });

    addRow('selectName', paramName(select));
    addRow('selectPlaceholder', placeholder);
    if (ul.children.length) addRow('selectOptions', ul);
  }

  const keyword = element.querySelector('input[type="text"], input[type="search"], input:not([type])');
  if (keyword) {
    addRow('keywordName', 'keyword');
    const ph = (keyword.getAttribute('placeholder') || keyword.getAttribute('title') || keyword.getAttribute('value') || '').trim();
    addRow('keywordPlaceholder', ph || 'Type in keyword(s) here');
  }

  const button = element.querySelector('#btnGo, .buttonFilter, button, input[type="submit"]');
  const buttonText = button ? (button.textContent.trim() || (button.getAttribute('value') || '').trim()) : '';
  addRow('button', buttonText || 'GO');

  const block = WebImporter.Blocks.createBlock(document, { name: 'listing-filter', cells: rows });
  element.replaceWith(block);
}
