/**
 * Form: a form authored in the Universal Editor as a list of Form Field items.
 *
 * Block rows: [submit label], [success message], [submit URL], then one row per Form Field item:
 *   [label | name | type | required | options | autofill hint | help text | error message].
 * Types: text, textarea, email, tel, date, number, select, radio, checkbox (input types), and
 * heading / note (text between fields).
 *
 * Validation is the browser's own (required, type) with inline messages shown only after the user
 * has interacted with a field (:user-invalid), kept in sync with aria-invalid. With no submit URL
 * the form only validates and shows the success message.
 *
 * Older content (a link to a /forms/*.json definition) has no fields to render: the block hides.
 */
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const INPUT_TYPES = ['text', 'textarea', 'email', 'tel', 'date', 'number', 'select', 'radio', 'checkbox'];
const DEFAULT_AUTOCOMPLETE = { email: 'email', tel: 'tel' };
const TYPE_MESSAGES = {
  email: 'Please enter a valid email address, e.g. name@example.com.',
  tel: 'Please enter a valid phone number.',
  date: 'Please enter a valid date.',
  number: 'Please enter a number.',
};

let formCount = 0;

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === 'className') node.className = value;
    else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, value);
  });
  node.append(...children);
  return node;
}

function readField(row) {
  const cells = [...row.children];
  const text = (i) => (cells[i]?.textContent || '').trim();
  const optionsCell = cells[4];
  let options = optionsCell ? [...optionsCell.querySelectorAll('li')].map((li) => li.textContent.trim()) : [];
  if (!options.length && text(4)) options = text(4).split(/\n|;/).map((o) => o.trim());
  return {
    label: text(0),
    name: text(1),
    type: (text(2) || 'text').toLowerCase(),
    required: text(3).toLowerCase() === 'true',
    options: options.filter(Boolean),
    autocomplete: text(5),
    help: text(6),
    errorMessage: text(7),
  };
}

function uniqueName(base, used) {
  let name = base || 'field';
  let i = 2;
  while (used.has(name)) {
    name = `${base}-${i}`;
    i += 1;
  }
  used.add(name);
  return name;
}

function buildControl(field, id, describedBy) {
  const common = {
    id,
    name: field.name,
    required: field.required,
    'aria-describedby': describedBy,
  };
  if (field.type === 'textarea') return el('textarea', { ...common, rows: 5 });
  if (field.type === 'select') {
    const select = el('select', { ...common, autocomplete: field.autocomplete || undefined });
    select.append(el('option', { value: '' }, 'Please select'));
    field.options.forEach((o) => select.append(el('option', { value: o }, o)));
    return select;
  }
  return el('input', {
    ...common,
    type: field.type,
    autocomplete: field.autocomplete || DEFAULT_AUTOCOMPLETE[field.type],
    inputmode: field.type === 'tel' ? 'tel' : undefined,
  });
}

function buildChoices(field, id, describedBy) {
  // a group of radio buttons / checkboxes in a fieldset; a lone checkbox has no options
  const choices = field.options.length ? field.options : [field.label];
  const group = el('fieldset', {
    className: 'form-choices',
    'aria-describedby': describedBy,
    'data-required': field.required && field.type === 'checkbox' && choices.length > 1,
  });
  if (field.options.length) group.append(el('legend', {}, field.label, field.required ? el('span', { className: 'form-required', 'aria-hidden': 'true' }, ' *') : ''));
  choices.forEach((choice, i) => {
    const input = el('input', {
      type: field.type,
      id: `${id}-${i}`,
      name: field.name,
      value: field.options.length ? choice : 'yes',
      // radios: one required radio makes the group required; checkboxes: see validateGroup
      required: field.required && (field.type === 'radio' || choices.length === 1),
    });
    group.append(el('label', { className: 'form-choice', for: `${id}-${i}` }, input, ` ${choice}`));
  });
  return group;
}

function buildField(field, formId, used) {
  if (field.type === 'heading') return el('h3', { className: 'form-heading' }, field.label);
  if (field.type === 'note') return el('p', { className: 'form-note' }, field.label);
  if (!INPUT_TYPES.includes(field.type)) field.type = 'text';

  field.name = uniqueName(toClassName(field.name || field.label).slice(0, 50), used);
  const id = `${formId}-${field.name}`;
  const helpId = field.help ? `${id}-help` : null;
  const errorId = `${id}-error`;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ');

  const wrapper = el('div', { className: `form-field form-${field.type}` });
  const isChoice = field.type === 'radio' || field.type === 'checkbox';
  if (isChoice) {
    wrapper.append(buildChoices(field, id, describedBy));
  } else {
    wrapper.append(
      el('label', { for: id }, field.label, field.required ? el('span', { className: 'form-required', 'aria-hidden': 'true' }, ' *') : ''),
      buildControl(field, id, describedBy),
    );
  }
  if (helpId) wrapper.append(el('p', { className: 'form-help', id: helpId }, field.help));
  const error = el('p', { className: 'form-error', id: errorId });
  error.dataset.required = field.errorMessage || `${field.label} is required.`;
  wrapper.append(error);
  return wrapper;
}

/** A required checkbox group needs at least one box checked. */
function validateGroup(group) {
  const boxes = [...group.querySelectorAll('input[type="checkbox"]')];
  const msg = boxes.some((b) => b.checked) ? '' : 'Please select at least one option.';
  boxes[0]?.setCustomValidity(msg);
}

/** Shows the matching message and syncs aria-invalid with the visual (:user-invalid) state. */
function updateState(control, force) {
  const wrapper = control.closest('.form-field');
  if (!wrapper) return;
  const error = wrapper.querySelector('.form-error');
  const v = control.validity;
  const invalid = force ? !v.valid : control.matches(':user-invalid');
  let message = '';
  if (!v.valid) {
    if (v.valueMissing || v.customError) message = error.dataset.required;
    else message = TYPE_MESSAGES[control.type] || control.validationMessage;
  }
  error.textContent = invalid ? message : '';
  wrapper.classList.toggle('form-field-invalid', invalid);
  wrapper.querySelectorAll('input, select, textarea').forEach((c) => {
    if (invalid) c.setAttribute('aria-invalid', 'true');
    else c.removeAttribute('aria-invalid');
  });
}

function showSuccess(block, form, message) {
  const status = el('div', { className: 'form-success', role: 'status', tabindex: '-1' });
  if (message && message.textContent.trim()) status.append(...message.childNodes);
  else status.append(el('p', {}, 'Thank you. Your submission has been received.'));
  form.replaceWith(status);
  status.focus();
}

async function submit(form, action) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = data[key] ? `${data[key]}, ${value}` : value;
  });
  const resp = await fetch(action, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  if (!resp.ok) throw new Error(`${resp.status}`);
}

export default function decorate(block) {
  const rows = [...block.children];
  const legacy = block.querySelector('a[href*="/forms/"][href$=".json"]');
  const itemRows = rows.filter((row) => row.children.length > 1);
  if (legacy || !itemRows.length) {
    block.replaceChildren();
    block.closest('.form-wrapper')?.setAttribute('hidden', '');
    return;
  }

  const [submitRow, messageRow, actionRow] = rows.filter((row) => row.children.length <= 1);
  const submitLabel = submitRow?.textContent.trim() || 'Submit';
  const message = messageRow?.firstElementChild || messageRow;
  const action = actionRow?.querySelector('a')?.href || actionRow?.textContent.trim() || '';

  formCount += 1;
  const formId = `form-${formCount}`;
  const used = new Set();
  const form = el('form', { className: 'form-body', id: formId, method: 'post' });
  itemRows.forEach((row) => {
    const node = buildField(readField(row), formId, used);
    // keep the Universal Editor markers so each field can be selected on the page
    moveInstrumentation(row, node);
    form.append(node);
  });
  const button = el('button', { type: 'submit', className: 'form-submit' }, submitLabel);
  const formError = el('p', { className: 'form-submit-error', role: 'alert' });
  form.append(el('div', { className: 'form-actions' }, button), formError);
  block.replaceChildren(form);

  const groups = [...form.querySelectorAll('fieldset[data-required]')];
  groups.forEach(validateGroup);

  // inline messages: shown when a field becomes :user-invalid (on leaving it or on submit), cleared
  // as soon as it is corrected
  form.addEventListener('focusout', (e) => { if (e.target.validity) updateState(e.target); });
  form.addEventListener('input', (e) => {
    if (!e.target.validity) return;
    const group = e.target.closest('fieldset[data-required]');
    if (group) validateGroup(group);
    if (e.target.hasAttribute('aria-invalid')) updateState(e.target);
  });
  form.addEventListener('change', (e) => {
    const group = e.target.closest('fieldset[data-required]');
    if (group) validateGroup(group);
    if (e.target.validity) updateState(e.target, e.target.hasAttribute('aria-invalid'));
  });
  // the browser fires "invalid" on each invalid control when submission is attempted: show the
  // inline messages instead of the browser's bubble, and move focus to the first invalid field
  let focusPending = false;
  form.addEventListener('invalid', (e) => {
    e.preventDefault();
    updateState(e.target, true);
    if (!focusPending) {
      focusPending = true;
      e.target.focus();
      queueMicrotask(() => { focusPending = false; });
    }
  }, true);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.dataset.submitting === 'true') return;
    formError.textContent = '';
    if (!action) {
      showSuccess(block, form, message);
      return;
    }
    form.dataset.submitting = 'true';
    button.disabled = true;
    try {
      await submit(form, action);
      showSuccess(block, form, message);
    } catch (err) {
      formError.textContent = 'Sorry, your submission could not be sent. Please try again later.';
      button.disabled = false;
    } finally {
      form.dataset.submitting = 'false';
    }
  });
}
