/**
 * News Feed: the latest News Room articles, read from the news query index (/news-index.json,
 * defined in helix-query.yaml). Authors set a heading and how many articles to show; the
 * articles (title, description, link) come from the published article pages.
 *
 * Block rows: [heading], [number of articles].
 */
import fetchNewsArticles from '../../scripts/news-index.js';

const DEFAULT_LIMIT = 4;

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

  const articles = (await fetchNewsArticles()).slice(0, limit);

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
