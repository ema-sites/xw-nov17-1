/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-related-links.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selector: div.resources-documents:has(> [id$='_pnlRight'])
 * Model: columns-related-links (columns/rows are block properties) - no field hints.
 * One row; one cell per link group (heading + bulleted list of links).
 * Groups are the left/right panels (.resourceSection / .documentSection, in either order).
 */

function cleanText(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

function buildGroup(document, section) {
  const nodes = [];
  const title = cleanText(section.querySelector('.resourcesTitle, .documentsTitle'));
  if (title) {
    const h = document.createElement('h3');
    h.textContent = title;
    nodes.push(h);
  }
  const ul = document.createElement('ul');
  section.querySelectorAll('li').forEach((li) => {
    const link = li.querySelector('a[href]');
    const text = cleanText(link || li);
    if (!text) return;
    const item = document.createElement('li');
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = text;
      item.append(a);
    } else {
      item.textContent = text;
    }
    ul.append(item);
  });
  if (ul.children.length) nodes.push(ul);
  return nodes.length ? nodes : '';
}

export default function parse(element, { document }) {
  let sections = Array.from(element.querySelectorAll(':scope > .resourceSection, :scope > .documentSection'));
  if (!sections.length) {
    sections = Array.from(element.querySelectorAll(':scope > [id$="_pnlLeft"], :scope > [id$="_pnlRight"]'));
  }

  const row = sections.map((section) => buildGroup(document, section)).filter((c) => c !== '');
  while (row.length < 2) row.push('');

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-related-links', cells });
  element.replaceWith(block);
}
