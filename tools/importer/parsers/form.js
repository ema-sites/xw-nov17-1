/* eslint-disable */
/* global WebImporter */

/**
 * Parser for form.
 * Source: https://www.cnv.org (form-page-sidebar, content-page-sidebar)
 * Selectors: div.mvc-form (Sitecore Forms), #mc_embed_signup (Mailchimp signup)
 * Model: form { submitLabel, successMessage (richtext), action } with form-field items
 *   { label, name, type, required, options (richtext list), autocomplete, help, errorMessage }.
 * Rows: [submitLabel], [successMessage], [action], then one 8-cell row per field, heading or note.
 *
 * The fields are authored content (editable in the Universal Editor), read from the source form:
 *  - Sitecore: each field is a .input-wrapper.input-<type> (text, textarea, email, tel, date,
 *    select, radiolist, checkboxlist); labels, options and the required message
 *    (data-val-required) come from its own children (wrappers are nested in the source markup).
 *  - Mailchimp: .mc-field-group (label + input; "required" class / asterisk).
 *  - h1-h6 and paragraphs between fields become heading / note items; copy before the first field
 *    stays as default content before the block.
 * The source submit URLs are not kept (they post to Sitecore / Mailchimp); reCAPTCHA is dropped.
 */

const TYPE_MAP = {
  text: 'text', textarea: 'textarea', multilinetext: 'textarea', email: 'email', tel: 'tel',
  telephone: 'tel', date: 'date', number: 'number', select: 'select', dropdownlist: 'select',
  dropdown: 'select', radiolist: 'radio', radio: 'radio', checkboxlist: 'checkbox', checkbox: 'checkbox',
};

const AUTOCOMPLETE = [
  [/e-?mail/i, 'email'],
  [/phone|telephone|\btel\b|cell/i, 'tel'],
  [/postal|zip/i, 'postal-code'],
  [/suite|unit|apartment|apt\b|address line 2/i, 'address-line2'],
  [/street|address/i, 'address-line1'],
  [/^\s*(your\s+)?city\b|municipality/i, 'address-level2'],
  [/province|state\b/i, 'address-level1'],
  [/organi[sz]ation|company|business name/i, 'organization'],
  [/(^|\s)(full\s+)?name\b|first and last name/i, 'name'],
];

function clean(node) {
  return node ? node.textContent.replace(/\s+/g, ' ').trim() : '';
}

function autocompleteFor(label, type) {
  if (type === 'email') return 'email';
  if (type === 'tel') return 'tel';
  if (!['text', 'textarea', 'select'].includes(type)) return '';
  const hit = AUTOCOMPLETE.find(([re]) => re.test(label));
  return hit ? hit[1] : '';
}

function cell(document, name, value) {
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(` field:${name} `));
  if (value && typeof value === 'object') frag.appendChild(value);
  else if (value) frag.appendChild(document.createTextNode(String(value)));
  return frag;
}

function optionList(document, options) {
  if (!options.length) return '';
  const ul = document.createElement('ul');
  options.forEach((o) => {
    const li = document.createElement('li');
    li.textContent = o;
    ul.appendChild(li);
  });
  return ul;
}

function itemRow(document, f) {
  return [
    cell(document, 'label', f.label),
    cell(document, 'name', ''),
    cell(document, 'type', f.type),
    cell(document, 'required', f.required ? 'true' : 'false'),
    cell(document, 'options', optionList(document, f.options || [])),
    cell(document, 'autocomplete', f.autocomplete || ''),
    cell(document, 'help', f.help || ''),
    cell(document, 'errorMessage', f.errorMessage || ''),
  ];
}

function sitecoreField(wrapper) {
  const typeClass = Array.from(wrapper.classList).find((c) => c.startsWith('input-') && c !== 'input-wrapper');
  let type = TYPE_MAP[(typeClass || '').replace('input-', '')] || 'text';
  const own = (sel) => Array.from(wrapper.querySelectorAll(sel)).filter((n) => n.closest('.input-wrapper') === wrapper);
  const controls = own('input:not([type="hidden"]):not([type="submit"]), select, textarea');
  if (!controls.length) return null;
  const control = controls[0];
  if (control.tagName === 'SELECT') type = 'select';
  else if (control.tagName === 'TEXTAREA') type = 'textarea';
  else if (TYPE_MAP[control.type] && type === 'text') type = TYPE_MAP[control.type];

  const labelEl = own('label').find((l) => !l.querySelector('input'));
  const label = clean(labelEl) || control.getAttribute('data-sc-field-name') || '';
  const requiredMsg = controls.map((c) => c.getAttribute('data-val-required')).find(Boolean) || '';
  let options = [];
  if (type === 'select') {
    options = Array.from(control.querySelectorAll('option')).map((o) => clean(o)).filter(Boolean);
  } else if (type === 'radio' || type === 'checkbox') {
    options = own('label').filter((l) => l.querySelector('input')).map((l) => clean(l)).filter(Boolean);
    if (type === 'checkbox' && options.length === 1 && !labelEl) options = [];
  }
  const required = !!requiredMsg || controls.some((c) => c.hasAttribute('required'));
  return {
    label,
    type,
    required,
    options,
    autocomplete: autocompleteFor(label, type),
    // keep the source message only when it differs from the block default "<label> is required."
    errorMessage: requiredMsg && requiredMsg.trim() !== `${label} is required.` ? requiredMsg.trim() : '',
  };
}

function mailchimpField(group) {
  const control = group.querySelector('input:not([type="hidden"]):not([type="submit"]), select, textarea');
  if (!control) return null;
  const labelEl = group.querySelector('label');
  const asterisk = labelEl && labelEl.querySelector('.asterisk');
  if (asterisk) asterisk.remove();
  const label = clean(labelEl) || control.getAttribute('placeholder') || control.getAttribute('name') || '';
  let type = control.tagName === 'SELECT' ? 'select' : control.tagName === 'TEXTAREA' ? 'textarea' : (TYPE_MAP[control.type] || 'text');
  const options = type === 'select' ? Array.from(control.querySelectorAll('option')).map((o) => clean(o)).filter(Boolean) : [];
  return {
    label,
    type,
    required: !!asterisk || control.classList.contains('required') || control.hasAttribute('required'),
    options,
    autocomplete: autocompleteFor(label, type),
  };
}

export default function parse(el, { document }) {
  // The catalog captured single fields as instances: always parse the whole form container once.
  // Later fields of the same form are gone with it.
  const element = el.closest('div.mvc-form, #mc_embed_signup') || el;
  const formEl = element.querySelector('[action], form') || element;
  const isMailchimp = element.matches('#mc_embed_signup') || !!element.querySelector('.mc-field-group');
  const fieldSel = isMailchimp ? '.mc-field-group' : '.input-wrapper';

  // the form ends at its submit button: in the scraped DOM, unclosed source markup can nest the
  // page footer inside the form element
  const submitEl = formEl.querySelector('input[type="submit"], button[type="submit"], button:not([type])');
  const beforeSubmit = (n) => !submitEl || !!(n.compareDocumentPosition(submitEl) & 4);
  const nodes = Array.from(formEl.querySelectorAll(`${fieldSel}, h1, h2, h3, h4, h5, h6, p`))
    .filter((n) => beforeSubmit(n) && !n.closest('#footer, #footer-background, footer, .footer-middle-section'));
  const firstFieldIndex = nodes.findIndex((n) => n.matches(fieldSel));
  const items = [];
  const intro = [];
  nodes.forEach((node, i) => {
    if (node.matches(fieldSel)) {
      const f = isMailchimp ? mailchimpField(node) : sitecoreField(node);
      if (f && f.label) items.push(f);
      return;
    }
    // headings / paragraphs: skip copy inside a field (labels, help) or in widgets
    if (node.closest('label, .g-recaptcha, .validation-summary-errors, .mc-field-group, .indicates-required')) return;
    if (node.closest(fieldSel) && !node.matches('h1, h2, h3, h4, h5, h6, p')) return;
    const text = clean(node);
    if (!text) return;
    if (firstFieldIndex === -1 || i < firstFieldIndex) {
      intro.push(node);
      return;
    }
    const big = /font-size:\s*(1[8-9]|[2-9]\d)px/i.test(node.getAttribute('style') || '');
    items.push({ label: text, type: /^H[1-6]$/.test(node.tagName) || big ? 'heading' : 'note' });
  });

  intro.forEach((node) => element.before(node));
  if (!items.some((f) => !['heading', 'note'].includes(f.type))) {
    // no recognisable fields: leave the copy, drop the empty form
    element.remove();
    return;
  }

  const submitLabel = submitEl ? (submitEl.getAttribute('value') || clean(submitEl) || 'Submit').trim() : 'Submit';

  const cells = [
    [cell(document, 'submitLabel', submitLabel)],
    [''],
    [''],
    ...items.map((f) => itemRow(document, f)),
  ];
  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
