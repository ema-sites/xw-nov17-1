/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news variant. Base: cards.
 * Source: https://www.cnv.org/
 * Selector: .homeNewsPanel > div:has(.eventItem)
 * Model: container with cards-news-card (image, imageAlt, text).
 * Each real .eventItem (commented-out items are not DOM elements) -> empty image cell +
 * text cell (date, h3 title link, abstract, Read More link).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.eventItem'));
  const cells = [];
  const clean = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  items.forEach((item) => {
    const date = clean(item.querySelector('.eventDate'));
    const titleLink = item.querySelector('.eventTitle a');
    const abstract = clean(item.querySelector('.eventAbstract'));
    const moreLink = item.querySelector('.learnMore a');

    // Cell 1: no image in source - empty cell, no field hint
    const imageCell = '';

    // Cell 2: text
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (date) {
      const p = document.createElement('p');
      p.textContent = date;
      textFrag.appendChild(p);
    }
    if (titleLink) {
      const h = document.createElement('h3');
      const a = document.createElement('a');
      a.setAttribute('href', titleLink.getAttribute('href'));
      a.textContent = clean(titleLink);
      h.appendChild(a);
      textFrag.appendChild(h);
    }
    if (abstract) {
      const p = document.createElement('p');
      p.textContent = abstract;
      textFrag.appendChild(p);
    }
    if (moreLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', moreLink.getAttribute('href'));
      a.textContent = clean(moreLink);
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imageCell, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
