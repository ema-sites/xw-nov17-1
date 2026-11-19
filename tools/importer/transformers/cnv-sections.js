/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for cnv.org.
 * Uses payload.template.sections (content-page-sidebar: hero-banner,
 * breadcrumb, main-content; no styles).
 *
 * beforeTransform: insert <hr> before every non-first section while parser
 * target elements still exist; styled sections get a temporary marker.
 * afterTransform: add Section Metadata after styled-section markers.
 */

const MARKER = 'data-excat-section-id';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // invalid selector: try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;
  const document = (payload && payload.document) || element.ownerDocument;
  const root = element || document.body;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(root, section);
      if (!el) continue;
      if (i === 0) {
        if (section.style) {
          const hr = document.createElement('hr');
          hr.setAttribute(MARKER, section.id);
          el.parentNode.insertBefore(hr, el);
        }
        continue;
      }
      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(MARKER, section.id);
      el.parentNode.insertBefore(hr, el);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const marker = root.querySelector(`hr[${MARKER}="${section.id}"]`);
      const anchor = marker || findSectionElement(root, section);
      if (!anchor) continue;
      const meta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (marker) {
        // Place metadata at the end of this section (before the next <hr> or end).
        let cursor = marker.nextSibling;
        let last = marker;
        while (cursor && !(cursor.nodeType === 1 && cursor.tagName === 'HR')) {
          last = cursor;
          cursor = cursor.nextSibling;
        }
        last.parentNode.insertBefore(meta, last.nextSibling);
        if (i === 0) marker.remove();
        else marker.removeAttribute(MARKER);
      } else {
        anchor.parentNode.insertBefore(meta, anchor.nextSibling);
      }
    }
  }
}
