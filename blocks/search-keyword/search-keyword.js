import { toClassName } from '../../scripts/aem.js';

/**
 * Search Keyword: a keyword box with a submit button (GO / Search) that sends the
 * query to a search or lookup page. Used for meeting, bylaw and address lookups.
 *
 * Key/value rows (key in the first cell, value in the second); all optional:
 *   Label       | visible label before the box (e.g. "Search")
 *   Placeholder | placeholder text (e.g. "Type in keyword(s) here")
 *   Button      | submit label (default "GO")
 *   Action      | page the query is sent to (default: current page)
 *   Param       | query parameter name (default "q")
 *
 * Options: `rounded` (rounded box and button), `blue-2` (alternate button style
 * hook for the design pass).
 */

function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const [keyCell, valueCell] = row.children;
    if (!keyCell || !valueCell) return;
    const key = toClassName(keyCell.textContent).replace(/-/g, '');
    if (!key) return;
    const link = valueCell.querySelector('a[href]');
    config[key] = link && key === 'action' ? link.getAttribute('href') : valueCell.textContent.trim();
  });
  return config;
}

let searchKeywordCount = 0;

export default function decorate(block) {
  const config = readConfig(block);
  const action = config.action || window.location.pathname;
  const param = config.param || 'q';
  searchKeywordCount += 1;
  const inputId = `search-keyword-${searchKeywordCount}`;

  const form = document.createElement('form');
  form.className = 'search-keyword-form';
  form.method = 'get';
  form.action = action;
  form.setAttribute('role', 'search');

  if (config.label) {
    const label = document.createElement('label');
    label.className = 'search-keyword-label';
    label.htmlFor = inputId;
    label.textContent = config.label;
    form.append(label);
  }

  const input = document.createElement('input');
  input.type = 'search';
  input.id = inputId;
  input.name = param;
  input.className = 'search-keyword-input';
  input.placeholder = config.placeholder || '';
  if (!config.label) input.setAttribute('aria-label', config.placeholder || 'Search');
  input.value = new URL(window.location.href).searchParams.get(param) || '';
  form.append(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'search-keyword-submit';
  button.textContent = config.button || 'GO';
  form.append(button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new URL(action, window.location.href);
    if (input.value.trim()) url.searchParams.set(param, input.value.trim());
    else url.searchParams.delete(param);
    window.location.href = url.href;
  });

  block.replaceChildren(form);
}
