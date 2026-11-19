/* eslint-disable */
/* global WebImporter */

/**
 * Parser for title-bar.
 * Source: https://www.cnv.org (Recollect waste widget header)
 * Selector: .widget-box > .widget-header
 * Model: title-bar { title (text), actions (richtext links) }.
 * Rows: [title], [actions] (actions row only when the header has action buttons).
 *
 * The Share dropdown is runtime UI added by the block, so it is not content.
 * Recollect action buttons (e.g. "Need help?") switch tool pages via data-page in script;
 * they are rebuilt as links to an in-page anchor (#<data-page>) since no URL exists.
 */

function clean(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

export default function parse(element, { document }) {
  const cells = [];

  const titleEl = element.querySelector('.widget-title, h1, h2, h3, h4');
  const title = clean(titleEl && titleEl.textContent);
  if (title) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:title '));
    frag.appendChild(document.createTextNode(title));
    cells.push([frag]);
  } else {
    cells.push(['']);
  }

  const links = [];
  element.querySelectorAll('.widget-toolbar').forEach((toolbar) => {
    if (toolbar.id === 'recollect-social' || toolbar.querySelector('.rCsocial')) return; // Share menu
    toolbar.querySelectorAll('a, button').forEach((btn) => {
      const text = clean(btn.textContent);
      if (!text) return;
      let href = btn.getAttribute('href') || '';
      if (!href || href === '#') {
        const page = btn.getAttribute('data-page');
        href = page ? `#${page.replace(/_/g, '-')}` : '';
      }
      if (!href) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = text;
      p.appendChild(a);
      links.push(p);
    });
  });

  if (links.length) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:actions '));
    links.forEach((l) => frag.appendChild(l));
    cells.push([frag]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'title-bar', cells });
  element.replaceWith(block);
}
