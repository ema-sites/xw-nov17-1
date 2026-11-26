/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-news (homepage news list + quick-link and council link lists).
 * Source: https://www.cnv.org/ (homepage)
 * Selector: #content-columns > div.container:has(div.home-page-content)
 * Model: columns (columns/rows are block properties) - no field hints in Columns cells.
 *
 * Rows (every row has the same 2 columns; blocks/columns-news drops empty cells):
 *   1. [news cell, ''] - h2 "City News & Events" (.homeNewsPanel .firstLineTitle), then per
 *      .eventItem: h3 > linked title, abstract paragraph, "Read More" link paragraph.
 *      The hidden .eventDate (display:none on the source) is not imported.
 *   2. [quick links cell, council cell] - per .home-links column: h2 (.links-title) and one
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

function newsCell(document, panel) {
  const nodes = [];
  const title = cleanText(panel.querySelector('.firstLineTitle'));
  if (title) {
    const h = document.createElement('h2');
    h.textContent = title;
    nodes.push(h);
  }
  panel.querySelectorAll('.eventItem').forEach((item) => {
    const titleLink = item.querySelector('.eventTitle a[href]');
    const titleText = cleanText(item.querySelector('.eventTitle'));
    if (titleText) {
      const h = document.createElement('h3');
      if (titleLink) h.appendChild(link(document, titleLink, titleText));
      else h.textContent = titleText;
      nodes.push(h);
    }
    const abstract = cleanText(item.querySelector('.eventAbstract'));
    if (abstract) {
      const p = document.createElement('p');
      p.textContent = abstract;
      nodes.push(p);
    }
    const more = item.querySelector('.learnMore a[href]');
    if (more && cleanText(more)) {
      const p = document.createElement('p');
      p.appendChild(link(document, more));
      nodes.push(p);
    }
  });
  return nodes;
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

export default function parse(element, { document }) {
  const rows = [];

  const newsPanel = element.querySelector('.homeNewsPanel');
  if (newsPanel) {
    const news = newsCell(document, newsPanel);
    if (news.length) rows.push([news, '']);
  }

  const linkColumns = Array.from(element.querySelectorAll('.home-links > div'))
    .map((col) => linksCell(document, col))
    .filter((nodes) => nodes.length);
  if (linkColumns.length) rows.push(linkColumns);

  // Nothing recognisable: leave the content as page text rather than an empty block.
  if (!rows.length) return;

  // Every row gets the same number of columns.
  const width = Math.max(2, ...rows.map((r) => r.length));
  const cells = rows.map((r) => (r.length < width ? r.concat(Array(width - r.length).fill('')) : r));

  // md2jcr maps every "Columns ..." block to the AEM columns component and drops the name, so the
  // news layout is a variant class of columns (kept through the columns model's classes field).
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns (news)', cells });
  element.replaceWith(block);
}
