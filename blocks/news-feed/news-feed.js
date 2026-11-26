/**
 * News Feed: the latest News Room articles, read from the news query index (/news-index.json,
 * defined in helix-query.yaml). Authors set a heading and how many articles to show; the
 * articles (title, description, link) come from the published article pages.
 *
 * Block rows: [heading], [number of articles].
 */
const INDEX = '/news-index.json';
const DEFAULT_LIMIT = 4;
// article paths carry their publication date: /<list>/<yyyy>/<m>/<d>/<slug>
const DATED_PATH = /\/(\d{4})\/(\d{1,2})\/(\d{1,2})\/[^/]+$/;

async function fetchIndex() {
  const urls = [`${INDEX}?limit=1000`];
  // the local preview serves a stand-in index under /content (the real one exists only on EDS)
  if (window.location.hostname === 'localhost') urls.unshift(`/content${INDEX}`);
  // eslint-disable-next-line no-restricted-syntax
  for (const url of urls) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const resp = await fetch(url);
      // eslint-disable-next-line no-await-in-loop
      if (resp.ok) return (await resp.json()).data || [];
    } catch (e) {
      // try the next location
    }
  }
  return [];
}

function articleDate(path) {
  const m = path.match(DATED_PATH);
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN;
}

function link(href, text) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  return a;
}

export default async function decorate(block) {
  const values = [...block.children].map((row) => row.textContent.trim());
  const heading = values.find((v) => v && !/^\d+$/.test(v)) || '';
  const limit = parseInt(values.find((v) => /^\d+$/.test(v)), 10) || DEFAULT_LIMIT;
  block.textContent = '';

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    block.append(h2);
  }

  const articles = (await fetchIndex())
    .map((item) => ({ ...item, date: articleDate(item.path || '') }))
    .filter((item) => item.title && !Number.isNaN(item.date))
    .sort((a, b) => (b.date - a.date) || ((+b.lastModified || 0) - (+a.lastModified || 0)))
    .slice(0, limit);

  if (!articles.length) {
    block.classList.add('news-feed-empty');
    return;
  }

  const list = document.createElement('ul');
  list.className = 'news-feed-list';
  articles.forEach((item) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    h3.append(link(item.path, item.title));
    li.append(h3);
    if (item.description) {
      const p = document.createElement('p');
      p.textContent = item.description;
      li.append(p);
    }
    const more = document.createElement('p');
    more.className = 'news-feed-more';
    const a = link(item.path, 'Read More');
    a.setAttribute('aria-label', `Read more: ${item.title}`);
    more.append(a);
    li.append(more);
    list.append(li);
  });
  block.append(list);
}
