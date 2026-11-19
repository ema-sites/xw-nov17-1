/* eslint-disable */
/* global WebImporter */

/**
 * Parser for breadcrumb.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selector: #breadcrumbs-navigation
 * Model: breadcrumb { trail (richtext) } - one cell holding a list of links;
 * the last item (plain text) is the current page.
 */
export default function parse(element, { document }) {
  // The catalog's breadcrumb line also holds other link-only elements (a "View as pdf" line,
  // icon link rows, footer links). Only the real trail becomes a breadcrumb; the rest stays page text.
  if (!element.matches('#breadcrumbs-navigation') && !element.closest('#breadcrumbs-navigation')) return;
  const ul = document.createElement('ul');
  const items = Array.from(element.querySelectorAll('ul > li'));

  items.forEach((item) => {
    const li = document.createElement('li');
    const link = item.querySelector('a[href]');
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = link.textContent.trim();
      li.append(a);
    } else {
      // Current page: text node(s) only; separators are icons with no text.
      const text = item.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;
      li.textContent = text;
    }
    ul.append(li);
  });

  const cells = [];
  if (ul.children.length) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:trail '));
    frag.appendChild(ul);
    cells.push([frag]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb', cells });
  element.replaceWith(block);
}
