/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for www.cnv.org.
 * Inserts <hr> section breaks (before parsers run) and Section Metadata
 * blocks for styled sections (after parsers run), driven by
 * payload.template.sections.
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
      // invalid selector in this environment, try the next one
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument || document;

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = findSectionElement(element, section);
      if (!el || !el.parentNode) continue;

      if (i > 0) {
        const hr = doc.createElement('hr');
        if (section.style) hr.setAttribute(MARKER, section.id);
        el.parentNode.insertBefore(hr, el);
      } else if (section.style) {
        // Temporary marker for a styled first section (removed in afterTransform)
        const hr = doc.createElement('hr');
        hr.setAttribute(MARKER, section.id);
        hr.setAttribute('data-excat-first-section', 'true');
        el.parentNode.insertBefore(hr, el);
      }
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);

      if (section.style) {
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });

        // Section Metadata goes at the end of the section: before the next section's <hr>
        const next = sections[i + 1];
        const nextMarker = next ? element.querySelector(`hr[${MARKER}="${next.id}"]`) : null;
        let placed = false;
        if (nextMarker && nextMarker.parentNode) {
          nextMarker.parentNode.insertBefore(metadata, nextMarker);
          placed = true;
        } else {
          const sectionEl = findSectionElement(element, section);
          if (sectionEl && sectionEl.parentNode) {
            sectionEl.after(metadata);
            placed = true;
          } else if (marker && marker.parentNode) {
            marker.after(metadata);
            placed = true;
          }
        }
        if (!placed) element.append(metadata);
      }
    }

    // Clean up markers; drop the first section's temporary <hr> entirely
    element.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => {
      if (hr.hasAttribute('data-excat-first-section')) {
        hr.remove();
      } else {
        hr.removeAttribute(MARKER);
      }
    });
  }
}
