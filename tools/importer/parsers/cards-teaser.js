/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-teaser.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selector: .content-section > div.featureRowsListing
 * Model: cards-teaser (classes: "" | large-image) with cards-teaser-card items
 *   { image (reference), imageAlt (collapsed), text (richtext) }.
 * One row per teaser: [image cell, body cell].
 *
 * Source shapes:
 *  - default: #featureRowItem (.featureRowImage + .featureRowDataContainer with
 *    .featureRowTitle and loose text / <p> summary)
 *  - large-image: .featureItem (.featureImage + .featureText with .featureTitle,
 *    .featureDescription, .learnMore)
 *  - large-image (free-form): inline-styled flex row with a text column and an image column.
 */

function cleanText(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

function imageCell(document, img) {
  if (!img || !img.getAttribute('src')) return '';
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:image '));
  const image = document.createElement('img');
  image.setAttribute('src', img.getAttribute('src'));
  image.setAttribute('alt', img.getAttribute('alt') || '');
  frag.appendChild(image);
  return frag;
}

function textCell(document, nodes) {
  const content = nodes.filter(Boolean);
  if (!content.length) return '';
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:text '));
  content.forEach((n) => frag.appendChild(n));
  return frag;
}

function titleHeading(document, titleEl) {
  const text = cleanText(titleEl);
  if (!text) return null;
  const h = document.createElement('h3');
  const link = titleEl.querySelector('a[href]');
  if (link) {
    const a = document.createElement('a');
    a.setAttribute('href', link.getAttribute('href'));
    if (link.getAttribute('target')) a.setAttribute('target', link.getAttribute('target'));
    a.textContent = text;
    h.appendChild(a);
  } else {
    h.textContent = text;
  }
  return h;
}

// Collect rich content from a container: elements are kept, loose text becomes <p>.
function richContent(document, container, skip) {
  const nodes = [];
  let pending = null;
  const flush = () => {
    if (pending && pending.textContent.trim()) nodes.push(pending);
    pending = null;
  };
  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeType === 1 && skip && node.matches(skip)) return;
    if (node.nodeType === 1 && node.tagName === 'BR') { flush(); return; }
    const inline = node.nodeType === 3 || (node.nodeType === 1 && /^(A|STRONG|B|EM|I|SPAN|SUP|SUB|U)$/.test(node.tagName));
    if (inline) {
      if (node.nodeType === 3 && !node.textContent.trim() && !pending) return;
      if (!pending) pending = document.createElement('p');
      pending.appendChild(node.nodeType === 3 ? document.createTextNode(node.textContent.replace(/\s+/g, ' ')) : node);
      return;
    }
    flush();
    if (node.nodeType === 1 && cleanText(node)) nodes.push(node);
  });
  flush();
  return nodes;
}

function parseLargeItem(document, item) {
  const nodes = [titleHeading(document, item.querySelector('.featureTitle'))];
  const desc = item.querySelector('.featureDescription');
  if (desc) nodes.push(...richContent(document, desc));
  const more = item.querySelector('.learnMore a[href]');
  if (more && cleanText(more)) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', more.getAttribute('href'));
    a.textContent = cleanText(more);
    p.appendChild(a);
    nodes.push(p);
  }
  return [imageCell(document, item.querySelector('.featureImage img, img')), textCell(document, nodes)];
}

function parseRowItem(document, item) {
  const nodes = [];
  const data = item.querySelector('.featureRowDataContainer');
  if (data) {
    nodes.push(titleHeading(document, data.querySelector('.featureRowTitle')));
    nodes.push(...richContent(document, data, '.featureRowTitle'));
  }
  return [imageCell(document, item.querySelector('.featureRowImage img, img')), textCell(document, nodes)];
}

export default function parse(element, { document }) {
  const cells = [];
  let variant = 'large-image';

  const rowItems = Array.from(element.querySelectorAll('[id="featureRowItem"]'));
  const largeItems = Array.from(element.querySelectorAll('.featureItem'));

  if (rowItems.length) {
    variant = null;
    rowItems.forEach((item) => cells.push(parseRowItem(document, item)));
  } else if (largeItems.length) {
    largeItems.forEach((item) => cells.push(parseLargeItem(document, item)));
  } else {
    // Guard: a page-layout root (catalog selector on a whole column layout) is not a
    // teaser; leave it as default content rather than folding the page into one card.
    if (element.querySelector('#left-side-column, .content-section, #page-content')) return;
    // Free-form teaser: one image + the surrounding text content.
    const img = element.querySelector('img');
    const image = imageCell(document, img);
    if (img) img.remove();
    let columns = Array.from(element.querySelectorAll(':scope > div > div'));
    if (!columns.length) columns = Array.from(element.querySelectorAll(':scope > div'));
    if (!columns.length) columns = [element];
    const textNodes = [];
    columns.forEach((col) => textNodes.push(...richContent(document, col)));
    if (img || textNodes.length) cells.push([image, textCell(document, textNodes)]);
  }

  if (!cells.length) cells.push(['', '']);

  const name = variant ? `cards-teaser (${variant})` : 'cards-teaser';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
