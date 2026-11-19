/* eslint-disable */
/* global WebImporter */

/**
 * Parser for table-data.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selectors: .infoPanel > div > table, .infoPanel > div > div > table, div.council-meeting-table
 * Model: table-data container (filter table-data[-N-columns], classes striped|bordered|no-header);
 *   rows are table-data-row / table-data-col-N items with fields column1text..column4text.
 * One block row per table row; each non-empty cell carries <!-- field:columnNtext -->.
 *
 * - Header: rows from <thead> (or rows made of <th>) come first; tables with no header
 *   markup get the `no-header` option so the block does not promote a data row.
 * - The model supports at most 4 columns. Council meeting lists (6 columns: date, type,
 *   agenda, agenda pack, minutes, video) become Date | Meeting | Documents | Video.
 *   Other tables wider than 4 columns fold the extra columns into column 4.
 * - Short rows (colspan) are padded with empty cells.
 */

const MAX_COLS = 4;

function isEmpty(node) {
  return !node.textContent.replace(/\u00a0/g, ' ').trim() && !node.querySelector('img, picture');
}

function cellNodes(td) {
  if (!td || isEmpty(td)) return [];
  // A cell holding only "-" (meaning "none") would become an empty list item in the import's
  // markdown step; keep it as a dash character that isn't read as a list marker.
  if (/^[-*+]$/.test(td.textContent.replace(/ /g, ' ').trim())) {
    return [td.ownerDocument.createTextNode('–')];
  }
  splitLinkedImages(td.ownerDocument, [td]);
  return Array.from(td.childNodes).filter((n) => n.nodeType !== 8);
}

// A link that wraps only an image (social icons) can't be mapped to a rich-text field by
// md2jcr (Universal Editor): a rich-text field stops at an image, and table cells have no image
// field after text. Replace it with a text link named after the link title or the image alt.
function splitLinkedImages(document, nodes) {
  nodes.forEach((node) => {
    if (node.nodeType !== 1) return;
    const anchors = node.matches('a') ? [node] : Array.from(node.querySelectorAll('a'));
    anchors.forEach((a) => {
      const img = a.querySelector('img');
      if (!img || a.textContent.replace(/\u00a0/g, ' ').trim()) return;
      const label = (a.getAttribute('title') || img.getAttribute('alt') || a.getAttribute('href') || '')
        .replace(/\s+(icon|logo)$/i, '').trim();
      (a.querySelector('picture') || img).remove();
      a.textContent = label;
    });
  });
}

function buildCell(document, nodes, index) {
  const content = nodes.filter((n) => !(n.nodeType === 3 && !n.textContent.replace(/\u00a0/g, ' ').trim()));
  if (!content.length) return '';
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(` field:column${index + 1}text `));
  content.forEach((n) => frag.appendChild(n));
  return frag;
}

function councilRows(table) {
  // [date, type, agenda, agendaPack, minutes, video] -> [date, type, documents, video]
  return Array.from(table.querySelectorAll('tr')).map((tr) => {
    const tds = Array.from(tr.children);
    const docs = [];
    tds.slice(2, tds.length - 1).forEach((td) => {
      td.querySelectorAll('a[href]').forEach((a) => {
        if (docs.length) docs.push(a.ownerDocument.createElement('br'));
        const link = a.ownerDocument.createElement('a');
        link.setAttribute('href', a.getAttribute('href'));
        link.textContent = a.textContent.replace(/\s+/g, ' ').trim();
        docs.push(link);
      });
    });
    return [cellNodes(tds[0]), cellNodes(tds[1]), docs, cellNodes(tds[tds.length - 1])];
  }).filter((r) => r.some((c) => c.length));
}

export default function parse(element, { document }) {
  const table = element.matches('table') ? element : element.querySelector('table');
  if (!table) {
    element.replaceWith(WebImporter.Blocks.createBlock(document, { name: 'table-data', cells: [['']] }));
    return;
  }

  let rows;
  let hasHeader;
  const council = element.matches('.council-meeting-table') || table.classList.contains('council-meetings-list');

  if (council && Array.from(table.querySelectorAll('tr')).some((tr) => tr.children.length > MAX_COLS)) {
    rows = councilRows(table);
    hasHeader = false;
  } else {
    const headRows = Array.from(table.querySelectorAll(':scope > thead > tr'));
    const bodyRows = Array.from(table.querySelectorAll(':scope > tbody > tr, :scope > tr, :scope > tfoot > tr'));
    if (!headRows.length && bodyRows.length && Array.from(bodyRows[0].children).every((c) => c.tagName === 'TH')) {
      headRows.push(bodyRows.shift());
    }
    hasHeader = headRows.length > 0;
    rows = [...headRows, ...bodyRows].map((tr) => {
      const cols = Array.from(tr.children).filter((c) => /^(TD|TH)$/.test(c.tagName)).map(cellNodes);
      if (cols.length > MAX_COLS) {
        const extra = cols.splice(MAX_COLS - 1);
        const merged = [];
        extra.forEach((nodes) => {
          if (!nodes.length) return;
          if (merged.length) merged.push(document.createElement('br'));
          merged.push(...nodes);
        });
        cols.push(merged);
      }
      return cols;
    }).filter((r) => r.length);
  }

  const width = Math.min(MAX_COLS, Math.max(1, ...rows.map((r) => r.length)));
  const cells = rows.map((r) => {
    const padded = r.concat(Array(Math.max(0, width - r.length)).fill([]));
    return padded.map((nodes, i) => buildCell(document, nodes, i));
  });
  if (!cells.length) cells.push(['']);

  // Source zebra rows: styling.js marks every other #page-content tbody row tr.odd and the site CSS
  // shades it (#f5f5f5) for tables in .infoPanel / .ui-widget-content / .ui-tabs, except
  // table.noZebraStripes; council meeting lists are not shaded. Tables with a header are striped by
  // the block CSS already; header-less zebra tables get the library's `striped` variant.
  const zebra = !council && !table.classList.contains('noZebraStripes')
    && !!table.closest('.infoPanel, .ui-widget-content, .ui-tabs');
  let name = 'table-data';
  if (!hasHeader) name = zebra ? 'table-data (no-header, striped)' : 'table-data (no-header)';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
