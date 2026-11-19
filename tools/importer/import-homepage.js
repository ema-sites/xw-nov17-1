/* eslint-disable */
/* global WebImporter */

import carouselParser from './parsers/carousel.js';
import breadcrumbParser from './parsers/breadcrumb.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsNewsParser from './parsers/columns-news.js';
import cnvCleanupTransformer from './transformers/cnv-cleanup.js';
import cnvSectionsTransformer from './transformers/cnv-sections.js';

const PAGE_TEMPLATE = {
  "name": "homepage",
  "urls": [
    "https://www.cnv.org/"
  ],
  "description": "Site landing page with its own layout, distinct from the sidebar content pages",
  "blocks": [
    {
      "name": "carousel",
      "instances": [
        "#home-banner-background"
      ],
      "pageInstances": {
        "https://www.cnv.org/": [
          "#home-banner-background"
        ]
      }
    },
    {
      "name": "breadcrumb",
      "instances": [
        "#breadcrumbs-navigation"
      ]
    },
    {
      "name": "cards-feature",
      "instances": [
        "#content-columns > div.container:has(div.homeCTAs)"
      ]
    },
    {
      "name": "columns-news",
      "instances": [
        "#content-columns > div.container:has(div.home-page-content)"
      ],
      "pageInstances": {
        "https://www.cnv.org/": [
          "#content-columns > div:nth-child(5)"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "hero-banner",
      "name": "Homepage banner slideshow",
      "selector": [
        "#home-banner-background"
      ],
      "style": null,
      "blocks": [
        "carousel"
      ],
      "defaultContent": []
    },
    {
      "id": "feature-cards",
      "name": "Feature link cards",
      "selector": [
        "#content-columns > div.container:has(div.homeCTAs)"
      ],
      "style": null,
      "blocks": [
        "cards-feature"
      ],
      "defaultContent": []
    },
    {
      "id": "news-links",
      "name": "City news, quick links and council meetings",
      "selector": [
        "#content-columns > div.container:has(div.home-page-content)"
      ],
      "style": null,
      "blocks": [
        "columns-news"
      ],
      "defaultContent": []
    }
  ],
  "pageCleanup": {
    "https://www.cnv.org/": []
  }
};

const parsers = {
  'carousel': carouselParser,
  'breadcrumb': breadcrumbParser,
  'cards-feature': cardsFeatureParser,
  'columns-news': columnsNewsParser,
};
// Late transformers change the DOM (section <hr> markers, shared fragments), so their beforeTransform
// runs after block discovery.
const sectionTransformers = [cnvSectionsTransformer];
const fragmentTransformers = [];
const lateTransformers = [...sectionTransformers, ...fragmentTransformers];
const transformers = [cnvCleanupTransformer, ...lateTransformers];
const earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
// Catalog selectors (pageInstances, pageCleanup) count the <script> and <hr> elements the importer
// removes before transform, so a catalog template finds its targets in preprocess.
const CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));

function executeTransformers(hookName, element, payload, list = transformers) {
  const enhancedPayload = { ...payload, template: payload.params?.targets?.template || PAGE_TEMPLATE };
  list.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template, url) {
  const pageBlocks = [];
  const pageKey = (u) => {
    try { const { origin, pathname } = new URL(u); return `${origin}${pathname.replace(/\/$/, '')}`; }
    catch { return u; }
  };
  const key = pageKey(url);
  const claim = (blockDef, selector) => {
    let matches = [];
    try { matches = document.querySelectorAll(selector); } catch { return; }
    matches.forEach((element) => {
      if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
      pageBlocks.push({ name: blockDef.name, selector, element });
    });
  };
  template.blocks.forEach((blockDef) => {
    const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
    (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
  });
  template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
  return pageBlocks;
}

// Runs the early transformers, then marks each block and section target with an attribute: the
// importer re-creates the body before transform, so only attributes survive, not element references.
function markPageTargets(payload) {
  const { document, params } = payload;
  executeTransformers('beforeTransform', document.body, payload, earlyTransformers);
  const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
    element.setAttribute('data-excat-block', String(i));
    return { name, selector };
  });
  const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
    const target = (section.selector || []).map((s) => { try { return document.querySelector(s); } catch { return null; } }).find(Boolean);
    if (!target) return section;
    target.setAttribute('data-excat-section', String(i));
    return { ...section, selector: [`[data-excat-section="${i}"]`] };
  });
  params.targets = { blocks, template: { ...PAGE_TEMPLATE, sections } };
}

export default {
  preprocess: (payload) => {
    if (CATALOG) markPageTargets(payload);
  },
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    params.fragments = [];

    if (!params.targets) markPageTargets(payload);
    const pageBlocks = params.targets.blocks
      .map((block, i) => ({ ...block, element: document.querySelector(`[data-excat-block="${i}"]`) }))
      .filter((block) => block.element);
    executeTransformers('beforeTransform', main, { ...payload, pageBlocks }, lateTransformers);

    pageBlocks.forEach((block) => {
      if (!main.contains(block.element)) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // A fragment's nodes left `main` before afterTransform: finalize it the same way, without the
    // page-only section breaks and metadata.
    params.fragments.forEach(({ element }) => {
      executeTransformers('afterTransform', element, payload, earlyTransformers);
      WebImporter.rules.transformBackgroundImages(element, document);
      WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
    });

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }, ...params.fragments];
  },
};
