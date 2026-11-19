/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for cnv.org (template: content-page-sidebar).
 *
 * beforeTransform: ONLY replays captured removals
 *   1. payload.template.pageCleanup[<current page URL>] selectors, in order
 *      (an element is removed only when the selector matches exactly one).
 *   2. catalog-template.json cleanup.rules[] outside <main>, for pages not
 *      listed in cleanup.pages (those already have page-specific cleanup).
 *
 * afterTransform: removes site chrome (header, mega/mobile menu, footer,
 * bottom bar, overlays, Google Translate, ASP.NET hidden fields, empty
 * spacers, left section navigation, social sharing, scripts/styles).
 */

// catalog-template.json cleanup.rules[] (captured with site chrome in place).
const CATALOG_RULES = [];

// catalog-template.json cleanup.pages keys: these pages skip CATALOG_RULES.
const CATALOG_PAGES = [
  'https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road',
  'https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street',
  'https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street',
  'https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/509-East-6th-Street',
  'https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/541-West-Keith-Road',
  'https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street',
  'https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/835---845-West-15th-Street',
  'https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street',
  'https://www.cnv.org/Comments',
];

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url, 'https://www.cnv.org');
    let path = decodeURIComponent(u.pathname).replace(/\/+$/, '');
    path = path.replace(/\.(html?|aspx)$/i, '');
    return `${u.hostname.toLowerCase().replace(/^www\./, '')}${path.toLowerCase()}`;
  } catch (e) {
    return String(url).toLowerCase().replace(/[?#].*$/, '').replace(/\/+$/, '');
  }
}

function getPageUrl(payload, element) {
  const doc = (payload && payload.document) || (element && element.ownerDocument);
  const candidates = [
    payload && payload.params && payload.params.originalURL,
    payload && payload.originalURL,
    payload && payload.url,
  ];
  if (doc) {
    const canonical = doc.querySelector('link[rel="canonical"]');
    if (canonical) candidates.push(canonical.getAttribute('href'));
    const ogUrl = doc.querySelector('meta[property="og:url"]');
    if (ogUrl) candidates.push(ogUrl.getAttribute('content'));
    // ASP.NET form action carries the page path on this site.
    const form = doc.querySelector('#mainform[action]');
    if (form) candidates.push(form.getAttribute('action'));
  }
  return candidates.filter((c) => c && !/^about:/.test(c));
}

function findPageEntry(map, urls) {
  if (!map || typeof map !== 'object') return null;
  const keys = Object.keys(map);
  for (const url of urls) {
    const n = normalizeUrl(url);
    const key = keys.find((k) => normalizeUrl(k) === n);
    if (key) return { key, value: map[key] };
  }
  return null;
}

function safeQueryAll(root, selector) {
  try {
    return Array.from(root.querySelectorAll(selector));
  } catch (e) {
    return [];
  }
}

function remove(root, selectors) {
  selectors.forEach((sel) => {
    safeQueryAll(root, sel).forEach((el) => el.remove());
  });
}

export default function transform(hookName, element, payload) {
  const document = (payload && payload.document) || element.ownerDocument;
  const root = document || element;

  if (hookName === 'beforeTransform') {
    const urls = getPageUrl(payload, element);

    // 1. Replay page-specific cleanup from page-templates.json.
    const template = payload && payload.template;
    const pageEntry = findPageEntry(template && template.pageCleanup, urls);
    if (pageEntry && Array.isArray(pageEntry.value)) {
      pageEntry.value.forEach((sel) => {
        const selector = typeof sel === 'string' ? sel : sel && sel.selector;
        if (!selector) return;
        const matches = safeQueryAll(root, selector);
        if (matches.length === 1) matches[0].remove();
      });
    }

    // 2. Catalog-wide rules, only for pages without page-specific cleanup.
    const listed = urls.some((u) => CATALOG_PAGES.some((p) => normalizeUrl(p) === normalizeUrl(u)));
    if (!listed) {
      CATALOG_RULES.forEach((rule) => {
        const selector = typeof rule === 'string' ? rule : rule && rule.selector;
        if (!selector) return;
        safeQueryAll(root, selector)
          .filter((el) => !el.closest('main'))
          .forEach((el) => el.remove());
      });
    }
  }

  if (hookName === 'afterTransform') {
    // Site header: the #mainform > div.container wrapping #header
    // (catalog selector "#mainform > div:nth-child(8)"), incl. mega + mobile menu.
    const header = root.querySelector('#header');
    if (header) {
      const headerContainer = header.closest('#mainform > div.container') || header;
      headerContainer.remove();
    }

    // Left section navigation (pure site navigation) and its menu title.
    // Keep #widgets (authorable widget content) in #left-side-column.
    remove(root, [
      '#left-side-navigation',
      '#left-side-navigation-items-deep',
      '#left-side-navigation .navigation-title',
    ]);

    remove(root, [
      // Header / nav leftovers (fallbacks when header container differs).
      '#navbar',
      '.top-menu-wrapper',
      '#ctl34_topMenuMegaWrap',
      '.top-menu-mega-wrap',
      // Footer area, incl. grey bottom bar (global footer, not a page block).
      '#footer-background',
      '#footer',
      'div.footer-middle-section',
      '.footer-bottom-section',
      // Google Translate widget.
      '#google_translate_element',
      '.goog-te-gadget',
      '.goog-te-banner-frame',
      'iframe.goog-te-menu-frame',
      '.skiptranslate',
      // Cookie / overlay popups.
      '#onetrust-consent-sdk',
      '.cookie-banner',
      '.cookie-consent',
      '[id*="cookie" i]',
      '.modal-backdrop',
      // Social sharing toolbar (AddThis).
      '#socialSharing',
      '.addthis_toolbox',
      // ASP.NET hidden fields.
      'div.aspNetHidden',
      'input[type="hidden"]',
      // Non-content elements.
      'script',
      'style',
      'noscript',
      'link',
    ]);

    // Site search page (search-results template): the 'Include' content-type checkboxes and the
    // empty results shell (loading gif, Sort By, 'No results found') belong to the old server-side
    // search, which EDS doesn't have; only the keyword box (search-keyword block) and heading stay.
    // Scoped to the page with the .search-filters column, so other pages' #filterResults are kept.
    if (root.querySelector('#left-side-column .search-filters')) {
      remove(root, ['#left-side-column', '#filterResults']);
    }

    // Single-panel "Related Links / Related Documents" lists stay page text (the two-panel ones
    // are columns-related-links blocks, already parsed). Their title is a styled <div> on the
    // source (21px heading look) that would import as a plain paragraph: make it an h3, as the
    // columns-related-links parser does for its panel titles.
    safeQueryAll(root, 'div.resourcesTitle, div.documentsTitle').forEach((div) => {
      const text = div.textContent.replace(/\s+/g, ' ').trim();
      if (!text) return;
      const h3 = div.ownerDocument.createElement('h3');
      h3.textContent = text;
      div.replaceWith(h3);
    });

    // Google Translate widgets injected at the end of <body> (tooltip/balloon with obfuscated
    // "VIpgJd-" classes): their translate-icon background would become an image on every page.
    remove(root, ['#goog-gt-tt', '.goog-tooltip', '[class*="VIpgJd-"]']);

    // Google reCAPTCHA challenge popup injected at the end of <body> on form pages (its iframe would
    // become a "recaptcha challenge expires in two minutes" link). Remove the iframe and the
    // wrappers left with no content.
    safeQueryAll(root, 'iframe').forEach((frame) => {
      const src = `${frame.getAttribute('src') || ''} ${frame.getAttribute('title') || ''}`;
      if (!/recaptcha/i.test(src)) return;
      let target = frame;
      while (target.parentElement && target.parentElement !== root.body && target.parentElement !== root
        && target.parentElement.tagName !== 'BODY' && !target.parentElement.textContent.trim()
        && !target.parentElement.querySelector('img, picture, video, table, iframe:not([src*="recaptcha"])')) {
        target = target.parentElement;
      }
      target.remove();
    });

    // Empty clear spacers.
    safeQueryAll(root, 'div.clear').forEach((el) => {
      if (!el.textContent.trim() && !el.querySelector('img, picture, video, iframe, table')) el.remove();
    });

    // Tracking / framework attributes.
    safeQueryAll(root, '[onclick], [data-ajax-success], [data-megawrap-id], [data-megaright-id]').forEach((el) => {
      ['onclick', 'data-ajax-success', 'data-megawrap-id', 'data-megaright-id'].forEach((a) => el.removeAttribute(a));
    });

    // Internal links: imported pages are saved under sanitized lowercase paths
    // (WebImporter.FileUtils.sanitizePath), but source links keep their capitals
    // (/Business-Development). Rewrite every internal page link to the same path the import saves,
    // so links resolve on the migrated site. Source media/documents (/-/media, /~/media, files)
    // are not migrated: point them at the source site.
    const SITE_HOST = /^(www\.)?cnv\.org$/i;
    const FILE_EXT = /\.(pdf|docx?|xlsx?|xlsm|pptx?|zip|jpe?g|png|gif|svg|webp|mp4|mp3|csv|txt|ashx|axd)$/i;
    const sanitize = (p) => {
      const fu = typeof WebImporter !== 'undefined' && WebImporter.FileUtils && WebImporter.FileUtils.sanitizePath;
      return fu ? fu(p) : p.toLowerCase();
    };
    safeQueryAll(root, 'a[href]').forEach((a) => {
      const raw = a.getAttribute('href');
      if (!raw || raw.startsWith('#') || /^(mailto|tel|javascript):/i.test(raw) || raw.startsWith('//')) return;
      let u;
      try { u = new URL(raw, 'https://www.cnv.org/'); } catch (e) { return; }
      if (!SITE_HOST.test(u.hostname)) return;
      const isRelative = raw.startsWith('/');
      if (/^\/(-|~)\//.test(u.pathname) || FILE_EXT.test(u.pathname)) {
        if (isRelative) a.setAttribute('href', `https://www.cnv.org${u.pathname}${u.search}${u.hash}`);
        return;
      }
      const clean = u.pathname.replace(/\/+$/, '').replace(/\.aspx?$/i, '');
      let target;
      try {
        target = clean === '' ? '/' : sanitize(clean);
      } catch (e) {
        // Badly encoded source link (e.g. a stray %): leave it as it is.
        return;
      }
      a.setAttribute('href', `${target}${u.search}${u.hash}`);
    });

    // Image addresses with a bare "%" (e.g. "?w=100%") can't be decoded by the importer
    // ("URI malformed"): encode it.
    safeQueryAll(root, 'img[src], source[srcset]').forEach((img) => {
      ['src', 'srcset'].forEach((attr) => {
        const v = img.getAttribute(attr);
        if (v && /%(?![0-9A-Fa-f]{2})/.test(v)) img.setAttribute(attr, v.replace(/%(?![0-9A-Fa-f]{2})/g, '%25'));
      });
    });

    // Links with no address (e.g. the hero banner image wrapped in <a href="">): keep the content.
    safeQueryAll(root, 'a[href=""], a:not([href])').forEach((a) => {
      a.replaceWith(...a.childNodes);
    });

    // The catalog recorded each card of a card row as its own block, so a row imports as several
    // one-card blocks. Merge back-to-back card blocks of the same kind into one block.
    const headerText = (table) => {
      const cell = table.rows && table.rows[0] && table.rows[0].cells[0];
      return cell ? cell.textContent.replace(/\s+/g, ' ').trim() : '';
    };
    const onlyWhitespaceBetween = (a, b) => {
      for (let n = a.nextSibling; n && n !== b; n = n.nextSibling) {
        if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())) return false;
      }
      return true;
    };
    safeQueryAll(root, 'table').forEach((table) => {
      if (!table.isConnected) return;
      const name = headerText(table);
      if (!/^cards/i.test(name)) return;
      let next = table.nextElementSibling;
      while (next && next.tagName === 'TABLE' && headerText(next) === name && onlyWhitespaceBetween(table, next)) {
        const body = table.tBodies[0] || table;
        Array.from(next.rows).slice(1).forEach((row) => body.appendChild(row));
        const drop = next;
        next = next.nextElementSibling;
        drop.remove();
      }
    });
  }
}
