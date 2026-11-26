#!/usr/bin/env node
/*
 * Work around an md2jcr escaping bug (@adobe/helix-md2jcr 1.5.19, filed upstream): link values that
 * md2jcr writes as XML attributes are not XML-escaped, so a "&" in a URL or a "<" in a link text
 * makes the JCR package fail ("Unescaped '<' not allowed in attributes values").
 *
 * md2jcr writes these links raw:
 *  - a default-content paragraph whose only content is one link (or one bold / italic link):
 *    it becomes a button (link, linkText, linkTitle);
 *  - a link in a block field that is not rich text (e.g. form "action", search "action",
 *    embed "uri"): the field value is the link URL.
 * Everything else (rich text, headings, images) is escaped correctly by md2jcr and is left alone.
 *
 * For those links only, this script escapes & < > " once more in the page HTML, so md2jcr's raw
 * output is valid XML that decodes to the original value. Local preview shows these few links
 * with a literal "&amp;"; the AEM content is correct. Safe to run more than once.
 *
 * Run after every import, after normalize-field-hints.mjs:
 *   node tools/importer/escape-jcr-link-attributes.mjs [content]
 * Remove once md2jcr escapes these attributes itself.
 */
import {
  existsSync, readdirSync, readFileSync, realpathSync, writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

async function loadJsdom() {
  try {
    // eslint-disable-next-line import/no-unresolved
    return await import('jsdom');
  } catch (e) {
    const base = process.env.EXCAT_MARKETPLACES_DIR || join(homedir(), '.excat-marketplaces');
    const fallback = join(base, 'excat-marketplace/excat/skills/excat-content-import/scripts/node_modules/jsdom/lib/api.js');
    if (!existsSync(fallback)) throw new Error('jsdom not found: npm i -D jsdom');
    return import(pathToFileURL(fallback).href);
  }
}

const { JSDOM } = await loadJsdom();
const project = process.cwd();
const root = realpathSync(process.argv[2] || 'content');

// block id -> { fieldName: component } for the block's own model and its child item models
const readJson = (f) => JSON.parse(readFileSync(join(project, f), 'utf8'));
const models = Object.fromEntries(readJson('component-models.json').map((m) => [m.id, m.fields || []]));
const definitions = readJson('component-definition.json').groups.flatMap((g) => g.components || []);
const filters = Object.fromEntries(readJson('component-filters.json').map((f) => [f.id, f.components || []]));
const defById = Object.fromEntries(definitions.map((d) => [d.id, d]));
function blockFields(blockId) {
  const tpl = defById[blockId]?.plugins?.xwalk?.page?.template || {};
  const childModel = (c) => defById[c]?.plugins?.xwalk?.page?.template?.model;
  const ids = [tpl.model, ...(filters[tpl.filter] || []).map(childModel)];
  const fields = {};
  ids.filter(Boolean).forEach((id) => (models[id] || []).forEach((f) => {
    fields[f.name] = f.component;
  }));
  return { fields, keyValue: Boolean(tpl['key-value']) };
}

const ALREADY = /&(amp|lt|gt|quot|#\d+);/;
const NEEDS = /[&<>"]/;
const esc = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let changed = 0;
function escapeLink(a) {
  let touched = false;
  ['href', 'title'].forEach((attr) => {
    const v = a.getAttribute(attr);
    if (v && NEEDS.test(v) && !ALREADY.test(v)) { a.setAttribute(attr, esc(v)); touched = true; }
  });
  const walker = a.ownerDocument.createTreeWalker(a, 4 /* SHOW_TEXT */);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (NEEDS.test(n.data) && !ALREADY.test(n.data)) { n.data = esc(n.data); touched = true; }
  }
  if (touched) changed += 1;
}

const meaningful = (el) => [...el.childNodes]
  .filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.data.trim()));
function standaloneLink(p) {
  const kids = meaningful(p);
  if (kids.length !== 1 || kids[0].nodeType !== 1) return null;
  const [k] = kids;
  if (k.tagName === 'A') return k;
  if (['STRONG', 'EM', 'B', 'I'].includes(k.tagName)) {
    const inner = meaningful(k);
    if (inner.length === 1 && inner[0].nodeType === 1 && inner[0].tagName === 'A') return inner[0];
  }
  return null;
}
const isColumnsBlock = (name) => name === 'columns' || name.startsWith('columns-');

function processBlock(block) {
  const name = block.classList[0];
  if (isColumnsBlock(name)) {
    block.querySelectorAll(':scope > div > div > p').forEach((p) => { const a = standaloneLink(p); if (a) escapeLink(a); });
    return;
  }
  const { fields, keyValue } = blockFields(name);
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (keyValue && cells.length === 2 && !cells[0].querySelector('a')) {
      const comp = fields[cells[0].textContent.trim()];
      if (comp && comp !== 'richtext') cells[1].querySelectorAll('a').forEach(escapeLink);
      return;
    }
    cells.forEach((cell) => {
      let field = null;
      [...cell.childNodes].forEach((n) => {
        if (n.nodeType === 8) {
          const m = n.data.trim().match(/^field:([A-Za-z0-9_]+)$/);
          if (m) [, field] = m;
          return;
        }
        if (n.nodeType !== 1 || !field) return;
        const comp = fields[field];
        if (!comp || comp === 'richtext') return;
        (n.tagName === 'A' ? [n] : [...n.querySelectorAll('a')]).forEach(escapeLink);
      });
    });
  });
}

function walk(dir, out = []) {
  readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.plain.html')) out.push(p);
  });
  return out;
}

let files = 0;
walk(root).forEach((file) => {
  const html = readFileSync(file, 'utf8');
  if (!/&|&lt;|&gt;|"/.test(html.replace(/<!--[\s\S]*?-->/g, ''))) return;
  const before = changed;
  const dom = new JSDOM(`<body>${html}</body>`);
  const { document } = dom.window;
  [...document.body.children].forEach((section) => {
    [...section.children].forEach((el) => {
      if (el.tagName === 'P') { const a = standaloneLink(el); if (a) escapeLink(a); } else if (el.tagName === 'DIV' && el.classList.length && !['metadata', 'section-metadata'].includes(el.classList[0])) processBlock(el);
    });
  });
  if (changed > before) {
    writeFileSync(file, document.body.innerHTML.replace(/<!--\s*(field:[A-Za-z0-9_]+)\s*-->/g, '<!-- $1 -->'));
    files += 1;
  }
  dom.window.close();
});
// eslint-disable-next-line no-console
console.log(JSON.stringify({ changedFiles: files, changedLinks: changed }));
