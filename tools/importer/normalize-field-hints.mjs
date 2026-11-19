#!/usr/bin/env node
/*
 * Normalize Universal Editor field hints in imported content.
 *
 * The parsers write field hints as `<!-- field:name -->`. On the live cnv.org pages the bundled
 * importer's html2md + md2da steps pad the comment with extra dashes
 * (`<!------ field:name ------>`), which md2jcr does not recognize as a hint
 * (it only accepts `<!--field:...-->` once whitespace is removed). Unrecognized hints become
 * content, so reference (image) fields and empty cells no longer map to the block models.
 *
 * Run after every import:  node tools/importer/normalize-field-hints.mjs [content]
 * Rewrites content/**\/*.plain.html in place and prints how many files and hints changed.
 */
import {
  readdirSync, readFileSync, realpathSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const HINT = /<!--+\s*(field:[A-Za-z0-9_]+)\s*-*-->/g;

function walk(dir, files = []) {
  readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else if (entry.name.endsWith('.plain.html')) files.push(path);
  });
  return files;
}

const root = realpathSync(process.argv[2] || 'content');
let changedFiles = 0;
let changedHints = 0;
walk(root).forEach((file) => {
  const html = readFileSync(file, 'utf8');
  let count = 0;
  const out = html.replace(HINT, (match, hint) => {
    const clean = `<!-- ${hint} -->`;
    if (match !== clean) count += 1;
    return clean;
  });
  if (count) {
    writeFileSync(file, out);
    changedFiles += 1;
    changedHints += count;
  }
});
console.log(JSON.stringify({ changedFiles, changedHints }));
