/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selectors: div.mvc-form (Sitecore Forms), #mc_embed_signup (Mailchimp signup)
 * Model: form { reference (aem-content: form definition), action (text: submit URL) }.
 * Rows: [reference link to /forms/<slug>.json], [action URL link].
 *
 * The blocks/form code fetches the definition JSON and renders the fields, so the
 * individual inputs are not block content. Authored copy that sits inside the source
 * form (title heading, intro paragraphs) is kept as default content before the block.
 * The form definition JSON (/forms/<slug>.json) must be created separately from the
 * source fields; slug = title heading, else Mailchimp list id, else Sitecore form id.
 */

function slugify(text) {
  return (text || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

function absolute(url) {
  if (!url) return '';
  try { return new URL(url.replace(/&amp;/g, '&'), 'https://www.cnv.org').href; } catch (e) { return url; }
}

export default function parse(el, { document }) {
  // The catalog captured single fields as instances: always parse the whole form container once.
  // Later fields of the same form are gone with it.
  const element = el.closest('div.mvc-form, #mc_embed_signup') || el;
  const formEl = element.querySelector('[action], form') || element;

  // Submit URL: action attribute, or Mailchimp's onclick="this.form.action='...'".
  let action = formEl.getAttribute('action') || '';
  if (!action) {
    const clicker = element.querySelector('[onclick*="action"]');
    const m = clicker && clicker.getAttribute('onclick').match(/action\s*=\s*['"]([^'"]+)['"]/);
    if (m) action = m[1];
  }
  action = absolute(action);

  // Intro copy inside the form: headings and paragraphs before the first field.
  const intro = [];
  const firstField = formEl.querySelector('.input-wrapper, .mc-field-group, input:not([type="hidden"]), textarea, select');
  formEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((node) => {
    if (firstField && !(node.compareDocumentPosition(firstField) & 4)) return; // after first field
    if (node.closest('.input-wrapper, .mc-field-group, label')) return;
    if (!node.textContent.trim()) return;
    intro.push(node);
  });

  const heading = intro.find((n) => /^H[1-6]$/.test(n.tagName));
  let slug = heading ? slugify(heading.textContent) : '';
  if (!slug) {
    const mc = action.match(/[?&]id=([a-z0-9]+)/i);
    if (/list-manage\.com/.test(action) && mc) slug = `mailchimp-${mc[1]}`;
  }
  if (!slug) {
    const fxb = formEl.getAttribute('data-sc-fxb') || (action.match(/FormItemId=([0-9a-f-]+)/i) || [])[1];
    slug = fxb ? `form-${fxb.toLowerCase()}` : 'form';
  }

  intro.forEach((node) => element.before(node));

  const cells = [];
  const refFrag = document.createDocumentFragment();
  refFrag.appendChild(document.createComment(' field:reference '));
  const ref = document.createElement('a');
  ref.setAttribute('href', `/forms/${slug}.json`);
  ref.textContent = `/forms/${slug}.json`;
  refFrag.appendChild(ref);
  cells.push([refFrag]);

  if (action) {
    const actFrag = document.createDocumentFragment();
    actFrag.appendChild(document.createComment(' field:action '));
    const a = document.createElement('a');
    a.setAttribute('href', action);
    a.textContent = action;
    actFrag.appendChild(a);
    cells.push([actFrag]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
