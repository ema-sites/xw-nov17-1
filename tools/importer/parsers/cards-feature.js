/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature variant. Base: cards.
 * Source: https://www.cnv.org/
 * Selector: .homeCTAs
 * Model: container with cards-feature-card (image, imageAlt, text).
 * Each .featureItem -> image cell (.featureImage img) + text cell (h3 title link, description, Learn More link).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.featureItem'));
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.featureImage img');
    const titleLink = item.querySelector('.featureTitle a');
    const descEl = item.querySelector('.featureDescription');
    const moreLink = item.querySelector('.learnMore a');

    // Cell 1: image
    const imageFrag = document.createDocumentFragment();
    if (img) {
      const image = document.createElement('img');
      image.setAttribute('src', img.getAttribute('src'));
      image.setAttribute('alt', img.getAttribute('alt') || '');
      imageFrag.appendChild(document.createComment(' field:image '));
      imageFrag.appendChild(image);
    }

    // Cell 2: text
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (titleLink) {
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.setAttribute('href', titleLink.getAttribute('href'));
      a.textContent = titleLink.textContent.trim();
      h.appendChild(a);
      textFrag.appendChild(h);
    }
    const desc = descEl ? descEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      textFrag.appendChild(p);
    }
    if (moreLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', moreLink.getAttribute('href'));
      a.textContent = moreLink.textContent.trim();
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
