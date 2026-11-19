/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selector: .content-section > div.call-out-5050-anchor
 * Model: columns-feature (columns/rows/classes are block properties) - no field hints
 * (Columns-type block). One row, two cells: text panel + image, in source visual order
 * (.image-right puts the image second).
 *
 * Variant: the markup of both variants is identical; the catalog assigned
 * `image-left-boxed-text` per page. The parser uses that page list (catalog-template.json
 * columns-feature v_f08a4b9afde2-1), resolving the page URL from og:url / canonical /
 * #mainform[action]. Fallback signal: a runtime style attribute on .call-out-5050-content
 * (present only on those pages in the cached samples).
 */

const BOXED_PAGES = [
  '/city-hall/mayor-council/mayor-linda-buchanan/community-updates',
  '/community-environment/social-planning/youth/studio-in-the-city',
  '/parks-recreation/play-cnv',
];

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
      const path = new URL(c, 'https://www.cnv.org').pathname.replace(/\/+$/, '').toLowerCase();
      if (path) return decodeURIComponent(path);
    } catch (e) { /* ignore */ }
  }
  return '';
}

function cleanText(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

function bgUrl(el) {
  if (!el) return null;
  const m = (el.getAttribute('style') || '').match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  return m ? m[1] : null;
}

function richContent(document, container) {
  container.querySelectorAll('style, script').forEach((n) => n.remove());
  const nodes = [];
  let pending = null;
  const flush = () => {
    if (pending && pending.textContent.trim()) nodes.push(pending);
    pending = null;
  };
  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeType === 8) return;
    if (node.nodeType === 1 && node.tagName === 'BR') { flush(); return; }
    const inline = node.nodeType === 3 || (node.nodeType === 1 && /^(A|STRONG|B|EM|I|SPAN|SUP|SUB|U)$/.test(node.tagName));
    if (inline) {
      if (node.nodeType === 3 && !node.textContent.trim() && !pending) return;
      if (!pending) pending = document.createElement('p');
      pending.appendChild(node.nodeType === 3 ? document.createTextNode(node.textContent.replace(/\s+/g, ' ')) : node);
      return;
    }
    flush();
    if (node.nodeType === 1 && (cleanText(node) || node.querySelector('img'))) nodes.push(node);
  });
  flush();
  return nodes;
}

export default function parse(element, { document, params }) {
  const columns = element.querySelector('.call-out-5050-columns') || element;
  const imageRight = columns.classList.contains('image-right');
  const content = columns.querySelector('.call-out-5050-content');
  const path = pagePath(document, params);
  const boxed = path
    ? BOXED_PAGES.includes(path)
    : !!(content && content.hasAttribute('style'));

  // Image cell: the <img> (mobile) or the background-image panel.
  const wrapper = columns.querySelector('.call-out-5050-image-wrapper');
  const srcImg = wrapper ? wrapper.querySelector('img') : columns.querySelector('img');
  const src = (srcImg && srcImg.getAttribute('src')) || bgUrl(columns.querySelector('.call-out-5050-image'));
  const imgLink = wrapper ? wrapper.querySelector('a[href]') : null;
  let imageCell = '';
  if (src) {
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', (srcImg && srcImg.getAttribute('alt')) || '');
    imageCell = img;
  }

  // Text cell: title heading + rich content.
  const textNodes = [];
  const titleEl = columns.querySelector('.featureTitle');
  const bodyEl = columns.querySelector('.call-out-content');
  const title = cleanText(titleEl);
  if (title) {
    const h = document.createElement('h3');
    const href = imgLink ? imgLink.getAttribute('href') : null;
    const linkedInBody = bodyEl && href && bodyEl.querySelector(`a[href="${href.replace(/"/g, '\\"')}"]`);
    if (href && !linkedInBody) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = title;
      h.appendChild(a);
    } else {
      h.textContent = title;
    }
    textNodes.push(h);
  }
  if (bodyEl) textNodes.push(...richContent(document, bodyEl));
  const textCell = textNodes.length ? textNodes : '';

  const cells = [imageRight ? [textCell, imageCell] : [imageCell, textCell]];

  const name = boxed ? 'columns-feature (image-left-boxed-text)' : 'columns-feature';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
