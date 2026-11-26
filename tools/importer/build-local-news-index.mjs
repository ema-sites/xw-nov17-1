#!/usr/bin/env node
/**
 * Local preview only: builds content/news-index.json, a stand-in for the Edge Delivery news query
 * index (helix-query.yaml, index "news" -> /news-index.json), from the imported News Room article
 * pages. The news-feed block reads it on localhost; on aem.page/aem.live it reads the real index,
 * which Edge Delivery fills when article pages are published.
 *
 * Usage: node tools/importer/build-local-news-index.mjs [contentDir]
 */
import {
  readdirSync, readFileSync, statSync, writeFileSync,
} from 'node:fs';
import { join, relative, sep } from 'node:path';

const contentDir = process.argv[2] || 'content';
const roots = ['city-hall/news-room/whats-new', 'city-hall/news-room/news-releases'];
const DATED = /\/\d{4}\/\d{1,2}\/\d{1,2}\/[^/]+$/;

const decode = (s) => s
  .replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function meta(html, key) {
  const re = new RegExp(`<div>\\s*${key}\\s*</div>\\s*<div>([\\s\\S]*?)</div>`, 'i');
  const m = html.match(re);
  return m ? decode(m[1]) : '';
}

function walk(dir) {
  let files = [];
  let entries = [];
  try { entries = readdirSync(dir); } catch (e) { return files; }
  entries.forEach((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files = files.concat(walk(p));
    else if (name.endsWith('.plain.html')) files.push(p);
  });
  return files;
}

const data = roots
  .flatMap((r) => walk(join(contentDir, r)))
  .map((file) => {
    const path = `/${relative(contentDir, file).split(sep).join('/').replace(/\.plain\.html$/, '')}`;
    if (!DATED.test(path)) return null;
    const html = readFileSync(file, 'utf8');
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    return {
      path,
      title: meta(html, 'Title') || (h1 ? decode(h1[1]) : ''),
      description: meta(html, 'Description'),
      image: '',
      lastModified: String(Math.floor(statSync(file).mtimeMs / 1000)),
    };
  })
  .filter(Boolean);

const out = join(contentDir, 'news-index.json');
writeFileSync(out, `${JSON.stringify({
  total: data.length, offset: 0, limit: data.length, data, ':type': 'sheet',
}, null, 2)}\n`);
// eslint-disable-next-line no-console
console.log(`${out}: ${data.length} articles`);
