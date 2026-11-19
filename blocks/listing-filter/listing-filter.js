import { toClassName } from '../../scripts/aem.js';

/**
 * Listing Filter: a category dropdown, an optional keyword input and a GO button
 * that filter a listing (e.g. map catalogue, bid notices).
 *
 * Key/value rows (key in the first cell, value in the second):
 *   Select Name         | query parameter for the dropdown (default "category")
 *   Select Placeholder  | first, empty choice (e.g. "Category")
 *   Select Options      | list of choices; "Label | value" sets a distinct value
 *   Keyword Name        | query parameter for the keyword box (omit to hide it)
 *   Keyword Placeholder | placeholder text (e.g. "Type in keyword(s) here")
 *   Button              | submit label (default "GO")
 *   Action              | URL the filter submits to (default: current page)
 *
 * Submitting navigates to Action with the chosen values as query parameters;
 * current parameters pre-fill the controls.
 */

function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const [keyCell, valueCell] = row.children;
    if (!keyCell || !valueCell) return;
    const key = toClassName(keyCell.textContent).replace(/-/g, '');
    if (!key) return;
    const items = valueCell.querySelectorAll('li');
    const paragraphs = valueCell.querySelectorAll('p');
    const link = valueCell.querySelector('a[href]');
    if (items.length) config[key] = [...items].map((li) => li.textContent.trim());
    else if (paragraphs.length > 1) config[key] = [...paragraphs].map((p) => p.textContent.trim());
    else config[key] = valueCell.textContent.trim();
    if (link) config[`${key}href`] = link.getAttribute('href');
  });
  return config;
}

function toOptions(value) {
  if (!value) return [];
  const list = Array.isArray(value) ? value : value.split(/\s*[,;\n]\s*/);
  return list.filter(Boolean).map((entry) => {
    const [label, val] = entry.split('|').map((s) => s.trim());
    return { label, value: val ?? label };
  });
}

export default function decorate(block) {
  const config = readConfig(block);
  const params = new URLSearchParams(window.location.search);
  const action = config.actionhref || config.action || window.location.pathname;

  const form = document.createElement('form');
  form.className = 'listing-filter-form';
  form.method = 'get';
  form.action = action;
  form.setAttribute('role', 'search');

  const options = toOptions(config.selectoptions);
  if (options.length) {
    const selectName = config.selectname || 'category';
    const select = document.createElement('select');
    select.name = selectName;
    select.className = 'listing-filter-select';
    select.setAttribute('aria-label', config.selectplaceholder || 'Filter');
    if (config.selectplaceholder) {
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = config.selectplaceholder;
      select.append(placeholder);
    }
    options.forEach(({ label, value }) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      if (params.get(selectName) === value) option.selected = true;
      select.append(option);
    });
    form.append(select);
  }

  if (config.keywordname) {
    const input = document.createElement('input');
    input.type = 'search';
    input.name = config.keywordname;
    input.className = 'listing-filter-keyword';
    input.placeholder = config.keywordplaceholder || '';
    input.setAttribute('aria-label', config.keywordplaceholder || 'Keyword');
    input.value = params.get(config.keywordname) || '';
    form.append(input);
  }

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'listing-filter-submit';
  button.textContent = config.button || 'GO';
  form.append(button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new URL(action, window.location.href);
    new FormData(form).forEach((value, name) => {
      if (value) url.searchParams.set(name, value);
      else url.searchParams.delete(name);
    });
    window.location.href = url.href;
  });

  block.replaceChildren(form);
}
