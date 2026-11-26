/**
 * News Search: year + keyword search over the news query index (/news-index.json), with
 * paginated results (title, date, description), as on the source News Room pages.
 *
 * Block rows: [folder] (optional path that limits results, e.g. /city-hall/news-room/news-releases;
 * empty = all News Room articles), [results per page].
 * The search state is kept in the URL (?year=&q=&page=), so results can be shared and bookmarked.
 */
import fetchNewsArticles, { formatDate } from '../../scripts/news-index.js';

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_LINKS = 10;

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') node.className = value;
    else node.setAttribute(key, value);
  });
  node.append(...children);
  return node;
}

function readState() {
  const params = new URLSearchParams(window.location.search);
  return {
    year: params.get('year') || '',
    q: (params.get('q') || '').trim(),
    page: Math.max(1, parseInt(params.get('page'), 10) || 1),
  };
}

function writeState({ year, q, page }) {
  const params = new URLSearchParams(window.location.search);
  [['year', year], ['q', q], ['page', page > 1 ? String(page) : '']].forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });
  const search = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
}

function matches(article, { year, q }) {
  if (year && String(article.date.getUTCFullYear()) !== year) return false;
  if (!q) return true;
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).every((word) => text.includes(word));
}

function pagination(page, pages, go) {
  const nav = el('nav', { className: 'news-search-pagination', 'aria-label': 'Results pages' });
  if (pages < 2) return nav;
  const start = Math.min(page - Math.floor(MAX_PAGE_LINKS / 2), pages - MAX_PAGE_LINKS + 1);
  const first = Math.max(1, start);
  const last = Math.min(pages, first + MAX_PAGE_LINKS - 1);
  const button = (label, target, extra = {}) => {
    const b = el('button', { type: 'button', ...extra }, label);
    b.addEventListener('click', () => go(target));
    return b;
  };
  if (page > 1) {
    nav.append(button('«', 1, { className: 'news-search-first', 'aria-label': 'First page' }));
    nav.append(button('‹', page - 1, { className: 'news-search-prev', 'aria-label': 'Previous page' }));
  }
  for (let i = first; i <= last; i += 1) {
    nav.append(i === page
      ? el('span', { className: 'news-search-current', 'aria-current': 'page' }, String(i))
      : button(String(i), i, { 'aria-label': `Page ${i}` }));
  }
  if (page < pages) {
    nav.append(button('›', page + 1, { className: 'news-search-next', 'aria-label': 'Next page' }));
    nav.append(button('»', pages, { className: 'news-search-last', 'aria-label': 'Last page' }));
  }
  return nav;
}

function resultItem(article) {
  const item = el('li', { className: 'news-search-item' });
  item.append(el('a', { className: 'news-search-title', href: article.path }, article.title));
  item.append(el('div', { className: 'news-search-date' }, formatDate(article.date)));
  if (article.description) item.append(el('p', { className: 'news-search-abstract' }, article.description));
  return item;
}

export default async function decorate(block) {
  const values = [...block.children].map((row) => row.textContent.trim());
  const folder = (values.find((v) => v.startsWith('/')) || '').replace(/\/+$/, '').toLowerCase();
  const pageSize = parseInt(values.find((v) => /^\d+$/.test(v)), 10) || DEFAULT_PAGE_SIZE;
  block.textContent = '';

  const all = (await fetchNewsArticles())
    .filter((a) => !folder || a.path.toLowerCase().startsWith(`${folder}/`));
  const years = [...new Set(all.map((a) => String(a.date.getUTCFullYear())))];

  // search form
  const yearSelect = el('select', { name: 'year', 'aria-label': 'Year' }, el('option', { value: '' }, 'Year'));
  years.forEach((y) => yearSelect.append(el('option', { value: y }, y)));
  const keyword = el('input', {
    type: 'search', name: 'q', placeholder: 'Type in keyword(s) here', 'aria-label': 'Keywords',
  });
  const go = el('button', { type: 'submit', className: 'news-search-go' }, 'Go');
  const form = el(
    'form',
    { className: 'news-search-form', role: 'search' },
    el('div', { className: 'news-search-fields' }, yearSelect, keyword, go),
    el('p', { className: 'news-search-help' }, 'Include a year, keyword(s), or both for your search.'),
  );

  const count = el('p', { className: 'news-search-count', 'aria-live': 'polite' });
  const topNav = el('div');
  const list = el('ul', { className: 'news-search-results' });
  const bottomNav = el('div');
  block.append(form, el('div', { className: 'news-search-header' }, count, topNav), list, bottomNav);

  let state = readState();
  yearSelect.value = years.includes(state.year) ? state.year : '';
  keyword.value = state.q;

  const render = (scroll) => {
    const found = all.filter((a) => matches(a, state));
    const pages = Math.max(1, Math.ceil(found.length / pageSize));
    state.page = Math.min(state.page, pages);
    writeState(state);
    count.textContent = `Returned ${found.length} result${found.length === 1 ? '' : 's'}`;
    list.replaceChildren(...found
      .slice((state.page - 1) * pageSize, state.page * pageSize)
      .map(resultItem));
    const goTo = (page) => { state = { ...state, page }; render(true); };
    topNav.replaceChildren(pagination(state.page, pages, goTo));
    bottomNav.replaceChildren(pagination(state.page, pages, goTo));
    if (scroll) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state = { year: yearSelect.value, q: keyword.value.trim(), page: 1 };
    render(false);
  });

  render(false);
}
