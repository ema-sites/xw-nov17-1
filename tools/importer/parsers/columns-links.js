/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-links variant. Base: columns.
 * Source: https://www.cnv.org/
 * Selector: .home-links
 * One row, two cells: .column-wide (h2 + single ul of links from both .links-list)
 * and .column-narrow (h2 + ul of links). Columns blocks get no field hints.
 */
export default function parse(element, { document }) {
  const buildColumn = (col) => {
    const frag = document.createDocumentFragment();
    if (!col) return frag;
    const titleEl = col.querySelector('.links-title');
    const title = titleEl ? titleEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (title) {
      const h = document.createElement('h2');
      h.textContent = title;
      frag.appendChild(h);
    }
    const links = Array.from(col.querySelectorAll('a[href]'))
      .filter((a) => !(titleEl && titleEl.contains(a)));
    if (links.length) {
      const ul = document.createElement('ul');
      links.forEach((link) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href'));
        a.textContent = link.textContent.replace(/\s+/g, ' ').trim();
        li.appendChild(a);
        ul.appendChild(li);
      });
      frag.appendChild(ul);
    }
    return frag;
  };

  const wide = element.querySelector(':scope > .column-wide');
  const narrow = element.querySelector(':scope > .column-narrow');
  const cells = [[buildColumn(wide), buildColumn(narrow)]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-links', cells });
  element.replaceWith(block);
}
