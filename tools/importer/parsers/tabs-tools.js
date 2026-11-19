/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-tools.
 * Source: https://www.cnv.org/Home-Property/Garbage-Recycling-Green-Can/Curbside-Collection
 * Selector: .widget-box > .widget-body > .widget-tablist-region (Recollect waste widget tabs)
 * Model: tabs-tools container of tabs-tools-item { title, title_icon, content_heading,
 *   content_headingType, content_image, content_richtext }.
 * One row per tab: [label cell: title + title_icon], [panel cell: content_richtext].
 *
 * blocks/tabs-tools loads a panel whose only content is a /fragments/ link with
 * loadFragment, so each panel cell holds that link and the panel content is pushed to
 * params.fragments as { element, path }. Recollect renders tool panels at runtime
 * (only the active tab's page is in the DOM), so a fragment holds the tab heading plus
 * the static copy of its rendered page (#rCpage-<tab>), when present. The interactive
 * Recollect tool itself needs a separate integration.
 *
 * Recollect icon URLs end in .svg (the importer would turn them into :icon: tokens);
 * the identical .png rendition is used instead.
 */

function slugify(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function iconSrc(src) {
  if (!src) return src;
  return /recollect-images\./.test(src) ? src.replace(/\.svg(\?|$)/i, '.png$1') : src;
}

function panelContent(document, pageEl) {
  const nodes = [];
  if (!pageEl) return nodes;
  // Static copy only: labels, headings, paragraphs (inputs/buttons are runtime UI).
  pageEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label').forEach((el) => {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const p = document.createElement(/^H[1-6]$/.test(el.tagName) ? 'h3' : 'p');
    p.textContent = text;
    nodes.push(p);
  });
  return nodes;
}

export default function parse(element, { document, params }) {
  const tabs = Array.from(element.querySelectorAll('[role="tab"], .widget-nav > li > a'))
    .filter((t, i, all) => all.indexOf(t) === i);
  const cells = [];

  tabs.forEach((tab) => {
    const title = (tab.getAttribute('data-title') || (tab.querySelector('.tab-name') || tab).textContent || '')
      .replace(/\s+/g, ' ').trim();
    if (!title) return;
    const page = tab.getAttribute('data-tab-page') || slugify(title);
    const path = `/fragments/recollect-waste/${slugify(page.replace(/_/g, '-'))}`;

    // Label cell: title (text) + title_icon (reference).
    const labelCell = document.createDocumentFragment();
    labelCell.appendChild(document.createComment(' field:title '));
    labelCell.appendChild(document.createTextNode(title));
    const iconEl = tab.querySelector('img');
    if (iconEl && iconEl.getAttribute('src')) {
      labelCell.appendChild(document.createComment(' field:title_icon '));
      const img = document.createElement('img');
      img.setAttribute('src', iconSrc(iconEl.getAttribute('src')));
      img.setAttribute('alt', iconEl.getAttribute('alt') || '');
      labelCell.appendChild(img);
    }

    // Panel cell: a single fragment link (content_richtext).
    const panelCell = document.createDocumentFragment();
    panelCell.appendChild(document.createComment(' field:content_richtext '));
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', path);
    a.textContent = path;
    p.appendChild(a);
    panelCell.appendChild(p);

    // Fragment content.
    if (params && Array.isArray(params.fragments)) {
      const frag = document.createElement('div');
      const h = document.createElement('h2');
      h.textContent = (tab.getAttribute('data-header-title') || title).trim();
      frag.appendChild(h);
      const pageEl = document.querySelector(`#rCpage-${page}`);
      panelContent(document, pageEl).forEach((n) => frag.appendChild(n));
      params.fragments.push({ element: frag, path });
    }

    cells.push([labelCell, panelCell]);
  });

  if (!cells.length) cells.push(['', '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-tools', cells });
  element.replaceWith(block);
}
