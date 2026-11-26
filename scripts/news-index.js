/**
 * News query index (helix-query.yaml, index "news" -> /news-index.json), shared by the
 * news-feed and news-search blocks.
 *
 * Returns the dated News Room articles, newest first. The publication date comes from the
 * article path (/<list>/<yyyy>/<m>/<d>/<slug>); listing pages in the index are skipped.
 */
const INDEX = '/news-index.json';
const DATED_PATH = /\/(\d{4})\/(\d{1,2})\/(\d{1,2})\/[^/]+$/;

let cache;

async function load() {
  const urls = [`${INDEX}?limit=5000`];
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

/**
 * @returns {Promise<Array<{path: string, title: string, description: string, date: Date}>>}
 */
export default async function fetchNewsArticles() {
  if (!cache) {
    cache = load().then((rows) => rows
      .map((row) => {
        const m = (row.path || '').match(DATED_PATH);
        if (!m || !row.title) return null;
        return {
          ...row,
          date: new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])),
          modified: +row.lastModified || 0,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b.date - a.date) || (b.modified - a.modified)));
  }
  return cache;
}

/** "November 20, 2026" (the source site's date format) */
export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}
