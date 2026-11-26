/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-news (homepage news list + quick-link and council link lists).
 * Source: https://www.cnv.org/ (homepage)
 * Selector: #content-columns > div.container:has(div.home-page-content)
 * Model: columns (columns/rows are block properties) - no field hints in Columns cells.
 *
 * Output: a news-feed block, then a columns (news) block.
 *   news-feed rows: [heading] (.homeNewsPanel .firstLineTitle), [number of .eventItem articles].
 *     The articles are not imported: the block lists the latest ones from /news-index.json.
 *   columns (news) row: [quick links cell, council cell] - per .home-links column: h2 (.links-title) and one
 *      list of its links (the two .links-list halves of Quick Links merge into one list,
 *      which the block flows into two columns).
 * Empty source panels (blank h1/h2 info panels, empty featureCTAs) are dropped.
 */

function cleanText(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

function link(document, a, text) {
  const el = document.createElement('a');
  el.setAttribute('href', a.getAttribute('href'));
  el.textContent = text || cleanText(a);
  return el;
}

function linksCell(document, column) {
  const nodes = [];
  const title = cleanText(column.querySelector('.links-title'));
  if (title) {
    const h = document.createElement('h2');
    h.textContent = title;
    nodes.push(h);
  }
  const ul = document.createElement('ul');
  column.querySelectorAll('a[href]').forEach((a) => {
    const text = cleanText(a);
    if (!text) return;
    const li = document.createElement('li');
    li.appendChild(link(document, a, text));
    ul.appendChild(li);
  });
  if (ul.children.length) nodes.push(ul);
  return nodes;
}

function field(document, name, value) {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(` field:${name} `));
  frag.appendChild(document.createTextNode(String(value)));
  return frag;
}

// The news panel becomes a news-feed block: its heading and article count are authored, the
// articles themselves come from the news query index (/news-index.json) at render time.
function newsFeedBlock(document, panel) {
  const title = cleanText(panel.querySelector('.firstLineTitle'));
  const count = panel.querySelectorAll('.eventItem').length || 4;
  if (!title && !panel.querySelector('.eventItem')) return null;
  return WebImporter.Blocks.createBlock(document, {
    name: 'news-feed',
    cells: [[field(document, 'title', title)], [field(document, 'limit', count)]],
  });
}

export default function parse(element, { document }) {
  const newsPanel = element.querySelector('.homeNewsPanel');
  const feed = newsPanel ? newsFeedBlock(document, newsPanel) : null;

  const rows = [];
  const linkColumns = Array.from(element.querySelectorAll('.home-links > div'))
    .map((col) => linksCell(document, col))
    .filter((nodes) => nodes.length);
  if (linkColumns.length) rows.push(linkColumns);

  const out = [];
  if (feed) out.push(feed);
  if (rows.length) {
    // Every row gets the same number of columns.
    const width = Math.max(2, ...rows.map((r) => r.length));
    const cells = rows.map((r) => (r.length < width ? r.concat(Array(width - r.length).fill('')) : r));
    // md2jcr maps every "Columns ..." block to the AEM columns component and drops the name, so
    // the links layout is a variant class of columns (kept through the columns model's classes field).
    out.push(WebImporter.Blocks.createBlock(document, { name: 'columns (news)', cells }));
  }

  // Nothing recognisable: leave the content as page text rather than an empty block.
  if (!out.length) return;
  element.replaceWith(...out);
}
