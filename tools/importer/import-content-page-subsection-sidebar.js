/* eslint-disable */
/* global WebImporter */

import breadcrumbParser from './parsers/breadcrumb.js';
import tableDataParser from './parsers/table-data.js';
import noticeParser from './parsers/notice.js';
import cnvCleanupTransformer from './transformers/cnv-cleanup.js';
import cnvSectionsTransformer from './transformers/cnv-sections.js';

const PAGE_TEMPLATE = {
  "name": "content-page-subsection-sidebar",
  "urls": [
    "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings/Part-3-Buildings",
    "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings/Part-3-Buildings-Prior-to-November-1st-2023",
    "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings/Part-9-Buildings",
    "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings/Part-9-Buildings--Prior-to-November-1st-2023",
    "https://www.cnv.org/City-Hall/News-Room/News-Releases/2026/5/14/Statement-from-CNV-Mayor-Linda-Buchanan-Regarding-the-Settlement-and-Review-of-the-NSWWTP",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Stormwater-Management-Plan-Requirements-for-New-Development/Stormwater-Management-for-Single-Family-and-Duplex-Developments",
    "https://www.cnv.org/Home-Property/Water-Sewer-Drainage/Drainage/Stormwater-Management-Plan-Requirements-for-New-Development/Stormwater-Management-for-Three-Units-or-More"
  ],
  "description": "Inner page with hero banner, multi-level breadcrumb and a left sidebar showing a nested sub-section menu, with long text content, numbered lists and data tables in the main column",
  "blocks": [
    {
      "name": "breadcrumb",
      "instances": [
        "#breadcrumbs-navigation"
      ]
    },
    {
      "name": "table-data",
      "instances": [
        ".accordion-item-content table",
        ".infoPanel > div > div > table",
        ".infoPanel > div > table",
        ".infoPanel table",
        "div.council-meeting-table"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings/Part-3-Buildings": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings/Part-3-Buildings-Prior-to-November-1st-2023": [
          "#phcontent_0_phcontentsections_0_ctl01_pnlInfo > div:nth-child(2) > table"
        ],
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings/Part-9-Buildings": [
          "#phcontent_0_phcontentsections_0_ctl03_pnlInfo > div:nth-child(2) > table"
        ]
      }
    },
    {
      "name": "notice",
      "instances": [
        ".content-section > div.call-out-info.call-out-icon"
      ],
      "pageInstances": {
        "https://www.cnv.org/Business-Development/Building/Energy-Efficient-Buildings-Initiative/New-Buildings/Part-9-Buildings": [
          "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
        ]
      }
    }
  ],
  "sections": [
    {
      "id": "hero-banner",
      "name": "Hero banner",
      "selector": [
        "#top-banner"
      ],
      "style": null,
      "blocks": [],
      "defaultContent": [
        "#top-banner"
      ]
    },
    {
      "id": "breadcrumb",
      "name": "Breadcrumb",
      "selector": [
        "#breadcrumbs-navigation"
      ],
      "style": null,
      "blocks": [
        "breadcrumb"
      ],
      "defaultContent": []
    },
    {
      "id": "main-content",
      "name": "Sidebar navigation and main content",
      "selector": [
        "#content-columns > div.container > div.content.layout-columns",
        "#content-columns .layout-columns"
      ],
      "style": null,
      "blocks": [
        "table-data",
        "notice"
      ],
      "defaultContent": [
        "#left-side-navigation .navigation-title",
        "#left-side-navigation-items-deep",
        "#page-content-section > h1",
        ".infoPanel > div > h2",
        ".infoPanel > div > h3",
        ".infoPanel > div > h4",
        ".infoPanel > div > p",
        ".infoPanel > div > ul",
        ".infoPanel > div > ol",
        ".infoPanel > div > img",
        ".infoPanel > div > a",
        "div.resources-documents",
        "div.mobile-accordion",
        "#widgets .widgets-section"
      ]
    }
  ]
};

const parsers = {
  'breadcrumb': breadcrumbParser,
  'table-data': tableDataParser,
  'notice': noticeParser,
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
