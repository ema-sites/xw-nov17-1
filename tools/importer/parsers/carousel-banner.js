/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-banner variant. Base: carousel.
 * Source: https://www.cnv.org/
 * Selector: #home-top-banner .banners
 * Model: container with carousel-banner-item (media_image, media_imageAlt, content_text).
 * Each direct child div is a slide: <a href><img><div.banner-overlay .contentWrapper(.title, .subtitle)></a>
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll(':scope > div'));
  const cells = [];

  slides.forEach((slide) => {
    const link = slide.querySelector(':scope > a[href]') || slide.querySelector('a[href]');
    const img = slide.querySelector('img');
    const titleEl = slide.querySelector('.contentWrapper .title');
    const subtitleEl = slide.querySelector('.contentWrapper .subtitle');
    const href = link ? link.getAttribute('href') : null;

    // Cell 1: image
    const imageFrag = document.createDocumentFragment();
    if (img) {
      const image = document.createElement('img');
      image.setAttribute('src', img.getAttribute('src'));
      image.setAttribute('alt', img.getAttribute('alt') || '');
      imageFrag.appendChild(document.createComment(' field:media_image '));
      imageFrag.appendChild(image);
    }

    // Cell 2: rich text (title, subtitle, link)
    const textFrag = document.createDocumentFragment();
    const title = titleEl ? titleEl.textContent.trim() : '';
    const subtitle = subtitleEl ? subtitleEl.textContent.trim() : '';
    if (title || subtitle || href) {
      textFrag.appendChild(document.createComment(' field:content_text '));
      if (title) {
        const h = document.createElement('h2');
        h.textContent = title;
        textFrag.appendChild(h);
      }
      if (subtitle) {
        const p = document.createElement('p');
        p.textContent = subtitle;
        textFrag.appendChild(p);
      }
      if (href) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = 'Learn More';
        p.appendChild(a);
        textFrag.appendChild(p);
      }
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-banner', cells });
  element.replaceWith(block);
}
