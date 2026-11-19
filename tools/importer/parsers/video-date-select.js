/* eslint-disable */
/* global WebImporter */

/**
 * Parser for video-date-select.
 * Source: https://www.cnv.org council video pages
 * Selector: #page-content > div:has(> select[id$='_dwnVideos']) (plus per-page roots
 *   wrapping the archive "Select a Date" <select id="location">)
 * Model: video-date-select { label (text), videos (richtext list of links) }.
 * Rows: [label], [list of links: date text -> video URL].
 *
 * Only the "Select a Date" dropdown is content; each option becomes a link to its video:
 *  - Sitecore dropdown (option value = item GUID, ASP.NET postback): the video page is
 *    <current page>?videoid=<guid as 32 lowercase hex> (same format the council meeting
 *    tables link to).
 *  - Archive dropdown (option value = video URL): the URL itself.
 * The "Select a date..." prompt option and the blank player iframe are not content.
 */

const GUID = /^\{?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}?$/i;

function pagePath(document, params) {
  const candidates = [];
  if (params && params.originalURL) candidates.push(params.originalURL);
  const og = document.querySelector('meta[property="og:url"]');
  if (og) candidates.push(og.getAttribute('content'));
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) candidates.push(canonical.getAttribute('href'));
  const form = document.querySelector('#mainform[action]');
  if (form) candidates.push(form.getAttribute('action'));
  for (const c of candidates) {
    try {
      const u = new URL(c, 'https://www.cnv.org');
      if (u.pathname && u.pathname !== '/') return u.pathname.replace(/\/+$/, '');
    } catch (e) { /* ignore */ }
  }
  return '';
}

export default function parse(element, { document, params }) {
  const select = element.querySelector('select[id$="_dwnVideos"], select#location')
    || element.querySelector('select');

  // Label: the span/label text in front of the dropdown.
  let label = '';
  const labelEl = element.querySelector('[id$="_lblSelectDate"]');
  if (labelEl) label = labelEl.textContent;
  else if (select && select.closest('label')) {
    label = Array.from(select.closest('label').childNodes)
      .filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ');
  } else if (select && select.previousElementSibling && /^(SPAN|LABEL|STRONG)$/.test(select.previousElementSibling.tagName)) {
    label = select.previousElementSibling.textContent;
  }
  label = label.replace(/\s+/g, ' ').trim() || 'Select a Date:';

  const base = pagePath(document, params);
  const ul = document.createElement('ul');
  if (select) {
    Array.from(select.querySelectorAll('option')).forEach((opt) => {
      const text = opt.textContent.replace(/\s+/g, ' ').trim();
      const value = (opt.getAttribute('value') || '').trim();
      if (!text || !value) return;
      if (/^select a date/i.test(text) || /^\{?0{8}-0{4}-0{4}-0{4}-0{12}\}?$/.test(value) || /video_blank\.html/i.test(value)) return;
      let href;
      const m = value.match(GUID);
      if (m) href = `${base}?videoid=${m.slice(1).join('').toLowerCase()}`;
      else if (/^(https?:)?\/\//i.test(value) || value.startsWith('/')) href = value;
      else return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = text;
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  const cells = [];
  const labelFrag = document.createDocumentFragment();
  labelFrag.appendChild(document.createComment(' field:label '));
  labelFrag.appendChild(document.createTextNode(label));
  cells.push([labelFrag]);

  if (ul.children.length) {
    const videosFrag = document.createDocumentFragment();
    videosFrag.appendChild(document.createComment(' field:videos '));
    videosFrag.appendChild(ul);
    cells.push([videosFrag]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-date-select', cells });

  // Only the "Select a Date" dropdown is the block: the root also holds the page heading and
  // intro text ("Select the Council Meeting date from the drop down menu..."), which stay as
  // page text. Replace the smallest element holding just the label and dropdown.
  if (select && element.contains(select)) {
    const ownText = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
    const allowed = ownText(labelEl) + ownText(select.closest('label') || select);
    let target = select.closest('label') || select;
    if (labelEl && !target.contains(labelEl)) {
      // label and select are siblings: climb to their common parent
      while (target.parentElement && target.parentElement !== element && !target.contains(labelEl)) {
        target = target.parentElement;
      }
      if (!target.contains(labelEl)) target = null;
    }
    // climb while the parent holds nothing but the label + dropdown
    while (target && target.parentElement && target.parentElement !== element
      && ownText(target.parentElement).length <= allowed.length + 2) {
      target = target.parentElement;
    }
    if (target && target !== element) {
      if (labelEl && !target.contains(labelEl)) labelEl.remove();
      target.replaceWith(block);
      return;
    }
  }
  element.replaceWith(block);
}
