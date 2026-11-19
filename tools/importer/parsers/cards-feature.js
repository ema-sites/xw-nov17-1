/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selectors: .content-section > div.featureCTAs, .content-section > div.featureListings,
 *   [id$='_pnlFeatureListingInfo'], .infoPanel div.featureListingsThreeColumn
 * Model: container of cards-feature-card { image (reference), imageAlt (collapsed), text (richtext) }.
 * One row per card: [image cell, text cell].
 *
 * Source shapes:
 *  - icon tile grid: .featured-grid > a (FontAwesome icon + .grid-item-title)
 *  - feature items: .featureItem (image or FA icon, .featureTitle, description, Learn More)
 * FontAwesome icons have no image asset; they are kept as an :icon-name: token at the
 * start of the text cell so the icon choice is not lost.
 */

const FA_NON_ICON = /^fa-(regular|solid|light|thin|duotone|sharp|brands|fw|lg|xs|sm|\d+x)$/;

function iconToken(scope) {
  const icon = scope.querySelector('i[class*="fa-"], em[class*="fa-"], span[class*="fa-"]');
  if (!icon) return null;
  const name = Array.from(icon.classList).find((c) => c.startsWith('fa-') && !FA_NON_ICON.test(c));
  return name ? `:${name}:` : null;
}

function cleanText(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

function makeLink(document, href, text) {
  if (!href) return document.createTextNode(text);
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.textContent = text;
  return a;
}

function buildImageCell(document, img) {
  if (!img) return '';
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:image '));
  const image = document.createElement('img');
  image.setAttribute('src', img.getAttribute('src'));
  image.setAttribute('alt', img.getAttribute('alt') || '');
  frag.appendChild(image);
  return frag;
}

function buildTextCell(document, nodes) {
  const content = nodes.filter(Boolean);
  if (!content.length) return '';
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(' field:text '));
  content.forEach((n) => frag.appendChild(n));
  return frag;
}

function parseGridTile(document, tile) {
  const nodes = [];
  const token = iconToken(tile);
  if (token) {
    const p = document.createElement('p');
    p.textContent = token;
    nodes.push(p);
  }
  const title = cleanText(tile.querySelector('.grid-item-title')) || cleanText(tile);
  if (title) {
    const p = document.createElement('p');
    p.appendChild(makeLink(document, tile.getAttribute('href'), title));
    nodes.push(p);
  }
  return [buildImageCell(document, tile.querySelector('img')), buildTextCell(document, nodes)];
}

function parseFeatureItem(document, item) {
  const nodes = [];
  const img = item.querySelector('img');
  if (!img) {
    const token = iconToken(item);
    if (token) {
      const p = document.createElement('p');
      p.textContent = token;
      nodes.push(p);
    }
  }

  const titleEl = item.querySelector('.featureTitle');
  const titleText = cleanText(titleEl);
  const titleLink = titleEl && titleEl.querySelector('a[href]');
  if (titleText) {
    const h = document.createElement('h3');
    h.appendChild(makeLink(document, titleLink && titleLink.getAttribute('href'), titleText));
    nodes.push(h);
  }

  const desc = item.querySelector('.featureDescription');
  if (desc && cleanText(desc)) {
    const p = document.createElement('p');
    p.textContent = cleanText(desc);
    nodes.push(p);
  }

  // Paragraph-authored descriptions / learn-more links (rich text variant).
  const learnMore = item.querySelector('.learnMore a[href]');
  item.querySelectorAll('p').forEach((para) => {
    if (para.closest('.featureTitle, .featureDescription, .learnMore')) return;
    const text = cleanText(para);
    if (!text) return;
    const link = para.querySelector('a[href]');
    const p = document.createElement('p');
    if (link && cleanText(link) === text) {
      p.appendChild(makeLink(document, link.getAttribute('href'), text.replace(/^>\s*/, '')));
    } else {
      p.textContent = text;
    }
    nodes.push(p);
  });

  if (learnMore && cleanText(learnMore)) {
    const p = document.createElement('p');
    p.appendChild(makeLink(document, learnMore.getAttribute('href'), cleanText(learnMore)));
    nodes.push(p);
  }

  return [buildImageCell(document, img), buildTextCell(document, nodes)];
}

export default function parse(element, { document }) {
  const cells = [];

  const featureItems = Array.from(element.querySelectorAll('.featureItem'));
  if (featureItems.length) {
    featureItems.forEach((item) => cells.push(parseFeatureItem(document, item)));
  } else {
    let tiles = Array.from(element.querySelectorAll('.featured-grid > a'));
    if (!tiles.length) tiles = Array.from(element.querySelectorAll(':scope > a'));
    tiles.forEach((tile) => cells.push(parseGridTile(document, tile)));
  }

  // No cards in this element (e.g. a feature-listing info panel: intro text + a link list):
  // it is page text, so leave it as it is rather than replacing it with an empty block.
  if (!cells.length) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
