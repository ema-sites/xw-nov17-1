/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon.
 * Source: https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Recycling
 * Selector: .popularSearches > div (Recollect "popular searches" widget rows)
 * Model: container of cards-icon-card { image (reference), imageAlt (collapsed), text (richtext) }.
 * One row per item: [image cell, caption cell].
 *
 * The circular image is a CSS background-image on .circle-border-imgs; it becomes an <img>.
 * The source anchors have an empty href (the widget routes by data-page in script), so
 * the caption is a link only when a real href exists; otherwise plain text.
 */

function bgUrl(el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const m = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  return m ? m[1] : null;
}

export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll('.page-row-content'));
  if (!items.length) items = Array.from(element.querySelectorAll('.page-row'));

  const cells = [];
  items.forEach((item) => {
    const captionEl = item.querySelector('.img-caption');
    const caption = captionEl ? captionEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const imgEl = item.querySelector('img');
    let src = imgEl ? imgEl.getAttribute('src') : bgUrl(item.querySelector('.circle-border-imgs, [style*="background-image"]'));
    // Recollect serves PNG bytes under a .svg name; the importer turns *.svg images into
    // :icon: tokens, so request the identical .png rendition instead.
    if (src && /recollect-images\./.test(src)) src = src.replace(/\.svg(\?|$)/i, '.png$1');
    if (!caption && !src) return;

    let imageCell = '';
    if (src) {
      imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(' field:image '));
      const img = document.createElement('img');
      img.setAttribute('src', src);
      img.setAttribute('alt', (imgEl && imgEl.getAttribute('alt')) || caption);
      imageCell.appendChild(img);
    }

    let textCell = '';
    if (caption) {
      textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:text '));
      const p = document.createElement('p');
      const link = item.querySelector('a');
      const href = link ? (link.getAttribute('href') || '').trim() : '';
      if (href && href !== '#') {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = caption;
        p.appendChild(a);
      } else {
        p.textContent = caption;
      }
      textCell.appendChild(p);
    }

    cells.push([imageCell, textCell]);
  });

  if (!cells.length) cells.push(['', '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
