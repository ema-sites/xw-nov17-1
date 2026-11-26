/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel (homepage banner slideshow).
 * Source: https://www.cnv.org/ (homepage)
 * Selector: #home-banner-background (wraps #home-top-banner .banners)
 * Model: carousel container of carousel-item { media_image (reference), media_imageAlt (collapsed),
 *   content_text (richtext), overlayPosition, overlayWidth, overlayOpacity }.
 *   One row per slide: [image cell, text cell, position, width, opacity]
 *   (text: title as heading, description, call-to-action link at the bottom).
 *
 * Source slide: #banners > div > a[href] > img + div.banner-overlay > .content-width
 *   > .contentWrapper > (.title, .subtitle). The overlay is empty when the caption is baked
 *   into the image. The whole slide is a link: it becomes a "Learn More" link in the text cell.
 */

function cleanText(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

export default function parse(element, { document }) {
  const banners = element.querySelector('#banners, .banners') || element;
  const slides = Array.from(banners.querySelectorAll(':scope > div')).filter((s) => s.querySelector('img'));
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    const link = slide.querySelector('a[href]');
    const href = link ? link.getAttribute('href') : '';

    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    const image = document.createElement('img');
    image.setAttribute('src', img.getAttribute('src'));
    image.setAttribute('alt', img.getAttribute('alt') || '');
    imageCell.appendChild(image);

    const nodes = [];
    const title = cleanText(slide.querySelector('.contentWrapper .title'));
    const subtitle = cleanText(slide.querySelector('.contentWrapper .subtitle'));
    if (title) {
      const h = document.createElement('h2');
      h.textContent = title;
      nodes.push(h);
    }
    if (subtitle) {
      const p = document.createElement('p');
      p.textContent = subtitle;
      nodes.push(p);
    }
    if (href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = 'Learn More';
      p.appendChild(a);
      nodes.push(p);
    }
    let textCell = '';
    if (nodes.length) {
      textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:content_text '));
      nodes.forEach((n) => textCell.appendChild(n));
    }

    // text box settings (source .contentWrapper): position class, inline width and background alpha
    const box = slide.querySelector('.contentWrapper');
    const cls = box ? Array.from(box.classList) : [];
    const position = cls.includes('topright') ? 'top-right'
      : cls.includes('bottomright') ? 'bottom-right'
        : (cls.includes('top') || cls.includes('topleft')) ? 'top-left'
          : (cls.includes('bottom') || cls.includes('bottomleft')) ? 'bottom-left' : 'bottom-right';
    const style = box ? (box.getAttribute('style') || '') : '';
    const width = (style.match(/(?:^|;)\s*width\s*:\s*(\d+)px/i) || [])[1] || '';
    const alpha = (style.match(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/i) || [])[1];
    const opacity = alpha !== undefined ? String(Math.round(parseFloat(alpha) * 100)) : '';
    const setting = (name, value) => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(` field:${name} `));
      if (value) frag.appendChild(document.createTextNode(value));
      return frag;
    };

    cells.push([imageCell, textCell, setting('overlayPosition', position),
      setting('overlayWidth', width), setting('overlayOpacity', opacity)]);
  });

  // No slides: leave the content as page text rather than an empty block.
  if (!cells.length) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
