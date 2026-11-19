/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selector: div.galleria (Galleria.js photo viewer, Flickr-backed)
 * Model: container of cards-gallery-card { image (reference), imageAlt (collapsed), text (richtext caption) }.
 * One row per photo: [image cell, caption cell].
 *
 * Cards are built from the thumbnail strip (.galleria-thumbnails img), which lists
 * every photo. The stage, lightbox, counter, info bar and nav buttons are runtime UI.
 * Thumbnail URLs (Flickr size suffix _q/_s/_t/_m/_n) are upgraded to the large (_b)
 * rendition. Per-photo captions are only used when the thumbnail carries alt/title;
 * Galleria shows the caption of the active photo only, so it is not reliable per card.
 */

function largeSrc(src) {
  if (!src) return src;
  return src.replace(/_(q|s|t|m|n|sq)\.(jpe?g|png|gif)(\?.*)?$/i, '_b.$2$3');
}

export default function parse(el, { document }) {
  // The catalog captured the gallery's pieces (thumbnails, stage, caption bar, buttons) as
  // separate instances: always parse the whole gallery once. Later pieces are gone with it.
  const element = el.closest('div.galleria') || el;
  let imgs = Array.from(element.querySelectorAll('.galleria-thumbnails img'));
  // Fallbacks: stage images (when thumbnails are disabled) or any authored image.
  if (!imgs.length) imgs = Array.from(element.querySelectorAll('.galleria-images img'));
  if (!imgs.length) imgs = Array.from(element.querySelectorAll('img'));

  const seen = new Set();
  const cells = [];
  imgs.forEach((img) => {
    const src = largeSrc(img.getAttribute('src') || img.getAttribute('data-src'));
    if (!src || seen.has(src)) return;
    seen.add(src);

    const caption = (img.getAttribute('title') || img.getAttribute('data-title') || img.getAttribute('alt') || '').trim();

    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    const image = document.createElement('img');
    image.setAttribute('src', src);
    image.setAttribute('alt', caption);
    imageFrag.appendChild(image);

    let textCell = '';
    if (caption) {
      textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:text '));
      const p = document.createElement('p');
      p.textContent = caption;
      textCell.appendChild(p);
    }

    cells.push([imageFrag, textCell]);
  });

  if (!cells.length) cells.push(['', '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
