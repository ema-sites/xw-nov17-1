/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selectors: .infoPanel table.columns-layout, plus per-page roots:
 *   .infoPanel > div > table.noZebraStripes (layout table of images) and
 *   a whole .infoPanel holding a .divRow / .divCell float layout.
 * Model: columns (columns/rows are block properties) - no field hints in Columns cells.
 * One block row per source row, one cell per source column; short rows are padded.
 */

function cellContent(document, source) {
  source.querySelectorAll('style, script').forEach((n) => n.remove());
  // Button wrappers become plain paragraphs holding the link.
  source.querySelectorAll('div.buttonGray, div.button').forEach((btn) => {
    const link = btn.querySelector('a[href]');
    if (!link) return;
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', link.getAttribute('href'));
    a.textContent = link.textContent.trim();
    p.append(a);
    btn.replaceWith(p);
  });
  const nodes = Array.from(source.childNodes).filter((n) => n.nodeType !== 8);
  return nodes.length ? nodes : '';
}

export default function parse(element, { document }) {
  const rows = [];

  const table = element.matches('table') ? element : element.querySelector('table');
  const divRows = Array.from(element.querySelectorAll('.divRow'));

  if (divRows.length) {
    // Float layout inside an info panel: keep the content before the layout
    // (section heading, intro) as default content ahead of the block.
    const firstRow = divRows[0];
    const container = firstRow.parentElement;
    const before = [];
    let node = container.firstChild;
    while (node && node !== firstRow) {
      const next = node.nextSibling;
      if (node.nodeType === 1 && !/^(STYLE|SCRIPT|BR)$/.test(node.tagName) && node.textContent.trim()) before.push(node);
      node = next;
    }
    before.forEach((n) => element.before(n));

    divRows.forEach((divRow) => {
      let cols = Array.from(divRow.querySelectorAll(':scope > .divCell'));
      if (!cols.length) cols = Array.from(divRow.children);
      rows.push(cols.map((col) => cellContent(document, col)));
    });
  } else if (table) {
    Array.from(table.querySelectorAll(':scope > tbody > tr, :scope > thead > tr, :scope > tr')).forEach((tr) => {
      const cols = Array.from(tr.querySelectorAll(':scope > td, :scope > th'));
      if (cols.length) rows.push(cols.map((col) => cellContent(document, col)));
    });
  }

  if (!rows.length) rows.push([cellContent(document, element)]);

  // Pad uneven rows so the block is a regular grid.
  const width = Math.max(...rows.map((r) => r.length));
  const cells = rows.map((r) => (r.length < width ? r.concat(Array(width - r.length).fill('')) : r));

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
