/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-content-page-subsection-sidebar.js
  var import_content_page_subsection_sidebar_exports = {};
  __export(import_content_page_subsection_sidebar_exports, {
    default: () => import_content_page_subsection_sidebar_default
  });

  // tools/importer/parsers/breadcrumb.js
  function parse(element, { document }) {
    if (!element.matches("#breadcrumbs-navigation") && !element.closest("#breadcrumbs-navigation")) return;
    const ul = document.createElement("ul");
    const items = Array.from(element.querySelectorAll("ul > li"));
    items.forEach((item) => {
      const li = document.createElement("li");
      const link = item.querySelector("a[href]");
      if (link) {
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.textContent = link.textContent.trim();
        li.append(a);
      } else {
        const text = item.textContent.replace(/\s+/g, " ").trim();
        if (!text) return;
        li.textContent = text;
      }
      ul.append(li);
    });
    const cells = [];
    if (ul.children.length) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:trail "));
      frag.appendChild(ul);
      cells.push([frag]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "breadcrumb", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-data.js
  var MAX_COLS = 4;
  function isEmpty(node) {
    return !node.textContent.replace(/\u00a0/g, " ").trim() && !node.querySelector("img, picture");
  }
  function cellNodes(td) {
    if (!td || isEmpty(td)) return [];
    if (/^[-*+]$/.test(td.textContent.replace(/ /g, " ").trim())) {
      return [td.ownerDocument.createTextNode("\u2013")];
    }
    splitLinkedImages(td.ownerDocument, [td]);
    return Array.from(td.childNodes).filter((n) => n.nodeType !== 8);
  }
  function splitLinkedImages(document, nodes) {
    nodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      const anchors = node.matches("a") ? [node] : Array.from(node.querySelectorAll("a"));
      anchors.forEach((a) => {
        const img = a.querySelector("img");
        if (!img || a.textContent.replace(/\u00a0/g, " ").trim()) return;
        const label = (a.getAttribute("title") || img.getAttribute("alt") || a.getAttribute("href") || "").replace(/\s+(icon|logo)$/i, "").trim();
        (a.querySelector("picture") || img).remove();
        a.textContent = label;
      });
    });
  }
  function buildCell(document, nodes, index) {
    const content = nodes.filter((n) => !(n.nodeType === 3 && !n.textContent.replace(/\u00a0/g, " ").trim()));
    if (!content.length) return "";
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:column${index + 1}text `));
    content.forEach((n) => frag.appendChild(n));
    return frag;
  }
  function councilRows(table) {
    return Array.from(table.querySelectorAll("tr")).map((tr) => {
      const tds = Array.from(tr.children);
      const docs = [];
      tds.slice(2, tds.length - 1).forEach((td) => {
        td.querySelectorAll("a[href]").forEach((a) => {
          if (docs.length) docs.push(a.ownerDocument.createElement("br"));
          const link = a.ownerDocument.createElement("a");
          link.setAttribute("href", a.getAttribute("href"));
          link.textContent = a.textContent.replace(/\s+/g, " ").trim();
          docs.push(link);
        });
      });
      return [cellNodes(tds[0]), cellNodes(tds[1]), docs, cellNodes(tds[tds.length - 1])];
    }).filter((r) => r.some((c) => c.length));
  }
  function parse2(element, { document }) {
    const table = element.matches("table") ? element : element.querySelector("table");
    if (!table) {
      element.replaceWith(WebImporter.Blocks.createBlock(document, { name: "table-data", cells: [[""]] }));
      return;
    }
    let rows;
    let hasHeader;
    const council = element.matches(".council-meeting-table") || table.classList.contains("council-meetings-list");
    if (council && Array.from(table.querySelectorAll("tr")).some((tr) => tr.children.length > MAX_COLS)) {
      rows = councilRows(table);
      hasHeader = false;
    } else {
      const headRows = Array.from(table.querySelectorAll(":scope > thead > tr"));
      const bodyRows = Array.from(table.querySelectorAll(":scope > tbody > tr, :scope > tr, :scope > tfoot > tr"));
      if (!headRows.length && bodyRows.length && Array.from(bodyRows[0].children).every((c) => c.tagName === "TH")) {
        headRows.push(bodyRows.shift());
      }
      hasHeader = headRows.length > 0;
      rows = [...headRows, ...bodyRows].map((tr) => {
        const cols = Array.from(tr.children).filter((c) => /^(TD|TH)$/.test(c.tagName)).map(cellNodes);
        if (cols.length > MAX_COLS) {
          const extra = cols.splice(MAX_COLS - 1);
          const merged = [];
          extra.forEach((nodes) => {
            if (!nodes.length) return;
            if (merged.length) merged.push(document.createElement("br"));
            merged.push(...nodes);
          });
          cols.push(merged);
        }
        return cols;
      }).filter((r) => r.length);
    }
    const width = Math.min(MAX_COLS, Math.max(1, ...rows.map((r) => r.length)));
    const cells = rows.map((r) => {
      const padded = r.concat(Array(Math.max(0, width - r.length)).fill([]));
      return padded.map((nodes, i) => buildCell(document, nodes, i));
    });
    if (!cells.length) cells.push([""]);
    const zebra = !council && !table.classList.contains("noZebraStripes") && !!table.closest(".infoPanel, .ui-widget-content, .ui-tabs");
    let name = "table-data";
    if (!hasHeader) name = zebra ? "table-data (no-header, striped)" : "table-data (no-header)";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/notice.js
  var FA_NON_ICON = /^fa-(regular|solid|light|thin|duotone|sharp|brands|fw|lg|xs|sm|\d+x)$/;
  function richContent(document, container, skip) {
    const nodes = [];
    let pending = null;
    const flush = () => {
      if (pending && pending.textContent.trim()) nodes.push(pending);
      pending = null;
    };
    Array.from(container.childNodes).forEach((node) => {
      if (node.nodeType === 8) return;
      if (node.nodeType === 1 && skip && node.matches(skip)) return;
      if (node.nodeType === 1 && node.tagName === "BR") {
        flush();
        return;
      }
      const inline = node.nodeType === 3 || node.nodeType === 1 && /^(A|STRONG|B|EM|I|SPAN|SUP|SUB|U|SMALL)$/.test(node.tagName);
      if (inline) {
        if (node.nodeType === 3 && !node.textContent.trim() && !pending) return;
        if (!pending) pending = document.createElement("p");
        pending.appendChild(node.nodeType === 3 ? document.createTextNode(node.textContent.replace(/\s+/g, " ")) : node);
        return;
      }
      flush();
      if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector("img"))) nodes.push(node);
    });
    flush();
    return nodes;
  }
  function parse3(element, { document }) {
    const columns = element.querySelector(".call-out-info-columns") || element;
    const cells = [];
    const iconImg = columns.querySelector(":scope > img, :scope > picture img");
    const faIcon = columns.querySelector(':scope > i[class*="fa-"], :scope > em[class*="fa-"], :scope > span[class*="fa-"]');
    let token = null;
    if (faIcon) {
      const name = Array.from(faIcon.classList).find((c) => c.startsWith("fa-") && !FA_NON_ICON.test(c));
      if (name) token = `:${name}:`;
      faIcon.remove();
    }
    if (iconImg) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:image "));
      const img = document.createElement("img");
      img.setAttribute("src", iconImg.getAttribute("src"));
      img.setAttribute("alt", iconImg.getAttribute("alt") || "");
      frag.appendChild(img);
      iconImg.remove();
      cells.push([frag]);
    } else {
      cells.push([""]);
    }
    const body = columns.querySelector(":scope > div") || columns;
    const nodes = [];
    if (token) {
      const p = document.createElement("p");
      p.textContent = token;
      nodes.push(p);
    }
    const title = body.querySelector(":scope > .featureTitle");
    if (title && title.textContent.trim()) {
      const h = document.createElement("h3");
      h.textContent = title.textContent.replace(/\s+/g, " ").trim();
      nodes.push(h);
    }
    nodes.push(...richContent(document, body, ".featureTitle"));
    const photos = [];
    nodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      const pics = n.matches("picture, img") ? [n] : Array.from(n.querySelectorAll("picture, img")).filter((p) => !(p.tagName === "IMG" && p.parentElement && p.parentElement.tagName === "PICTURE"));
      pics.forEach((pic) => {
        const holder = pic.closest("p");
        const p = document.createElement("p");
        p.appendChild(pic);
        photos.push(p);
        if (holder && !holder.textContent.trim() && !holder.querySelector("img, picture")) holder.remove();
      });
    });
    const kept = nodes.filter((n) => {
      var _a;
      return !(n.nodeType === 1 && !n.isConnected && !n.textContent.trim() && !((_a = n.querySelector) == null ? void 0 : _a.call(n, "img, picture"))) && !(n.nodeType === 1 && n.matches("picture, img"));
    });
    nodes.length = 0;
    nodes.push(...kept);
    if (nodes.length) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(" field:text "));
      nodes.forEach((n) => frag.appendChild(n));
      cells.push([frag]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "notice", cells });
    element.replaceWith(block);
    photos.reverse().forEach((p) => block.after(p));
  }

  // tools/importer/transformers/cnv-cleanup.js
  var CATALOG_RULES = [];
  var CATALOG_PAGES = [
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/115-East-Keith-Road",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/222-East-2nd-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/412-East-5th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/509-East-6th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/541-West-Keith-Road",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/648-West-14th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/835---845-West-15th-Street",
    "https://www.cnv.org/Business-Development/Building/Land-Use-Approvals/Active-Applications/971-West-1st-Street",
    "https://www.cnv.org/Comments"
  ];
  function normalizeUrl(url) {
    if (!url) return "";
    try {
      const u = new URL(url, "https://www.cnv.org");
      let path = decodeURIComponent(u.pathname).replace(/\/+$/, "");
      path = path.replace(/\.(html?|aspx)$/i, "");
      return `${u.hostname.toLowerCase().replace(/^www\./, "")}${path.toLowerCase()}`;
    } catch (e) {
      return String(url).toLowerCase().replace(/[?#].*$/, "").replace(/\/+$/, "");
    }
  }
  function getPageUrl(payload, element) {
    const doc = payload && payload.document || element && element.ownerDocument;
    const candidates = [
      payload && payload.params && payload.params.originalURL,
      payload && payload.originalURL,
      payload && payload.url
    ];
    if (doc) {
      const canonical = doc.querySelector('link[rel="canonical"]');
      if (canonical) candidates.push(canonical.getAttribute("href"));
      const ogUrl = doc.querySelector('meta[property="og:url"]');
      if (ogUrl) candidates.push(ogUrl.getAttribute("content"));
      const form = doc.querySelector("#mainform[action]");
      if (form) candidates.push(form.getAttribute("action"));
    }
    return candidates.filter((c) => c && !/^about:/.test(c));
  }
  function findPageEntry(map, urls) {
    if (!map || typeof map !== "object") return null;
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
  function transform(hookName, element, payload) {
    const document = payload && payload.document || element.ownerDocument;
    const root = document || element;
    if (hookName === "beforeTransform") {
      const urls = getPageUrl(payload, element);
      const template = payload && payload.template;
      const pageEntry = findPageEntry(template && template.pageCleanup, urls);
      if (pageEntry && Array.isArray(pageEntry.value)) {
        pageEntry.value.forEach((sel) => {
          const selector = typeof sel === "string" ? sel : sel && sel.selector;
          if (!selector) return;
          const matches = safeQueryAll(root, selector);
          if (matches.length === 1) matches[0].remove();
        });
      }
      const listed = urls.some((u) => CATALOG_PAGES.some((p) => normalizeUrl(p) === normalizeUrl(u)));
      if (!listed) {
        CATALOG_RULES.forEach((rule) => {
          const selector = typeof rule === "string" ? rule : rule && rule.selector;
          if (!selector) return;
          safeQueryAll(root, selector).filter((el) => !el.closest("main")).forEach((el) => el.remove());
        });
      }
    }
    if (hookName === "afterTransform") {
      const header = root.querySelector("#header");
      if (header) {
        const headerContainer = header.closest("#mainform > div.container") || header;
        headerContainer.remove();
      }
      remove(root, [
        "#left-side-navigation",
        "#left-side-navigation-items-deep",
        "#left-side-navigation .navigation-title"
      ]);
      remove(root, [
        // Header / nav leftovers (fallbacks when header container differs).
        "#navbar",
        ".top-menu-wrapper",
        "#ctl34_topMenuMegaWrap",
        ".top-menu-mega-wrap",
        // Footer area, incl. grey bottom bar (global footer, not a page block).
        "#footer-background",
        "#footer",
        "div.footer-middle-section",
        ".footer-bottom-section",
        // Google Translate widget.
        "#google_translate_element",
        ".goog-te-gadget",
        ".goog-te-banner-frame",
        "iframe.goog-te-menu-frame",
        ".skiptranslate",
        // Cookie / overlay popups.
        "#onetrust-consent-sdk",
        ".cookie-banner",
        ".cookie-consent",
        '[id*="cookie" i]',
        ".modal-backdrop",
        // Social sharing toolbar (AddThis).
        "#socialSharing",
        ".addthis_toolbox",
        // ASP.NET hidden fields.
        "div.aspNetHidden",
        'input[type="hidden"]',
        // Non-content elements.
        "script",
        "style",
        "noscript",
        "link"
      ]);
      if (root.querySelector("#left-side-column .search-filters")) {
        remove(root, ["#left-side-column", "#filterResults"]);
      }
      safeQueryAll(root, "div.resourcesTitle, div.documentsTitle").forEach((div) => {
        const text = div.textContent.replace(/\s+/g, " ").trim();
        if (!text) return;
        const h3 = div.ownerDocument.createElement("h3");
        h3.textContent = text;
        div.replaceWith(h3);
      });
      remove(root, ["#goog-gt-tt", ".goog-tooltip", '[class*="VIpgJd-"]']);
      safeQueryAll(root, "iframe").forEach((frame) => {
        const src = `${frame.getAttribute("src") || ""} ${frame.getAttribute("title") || ""}`;
        if (!/recaptcha/i.test(src)) return;
        let target = frame;
        while (target.parentElement && target.parentElement !== root.body && target.parentElement !== root && target.parentElement.tagName !== "BODY" && !target.parentElement.textContent.trim() && !target.parentElement.querySelector('img, picture, video, table, iframe:not([src*="recaptcha"])')) {
          target = target.parentElement;
        }
        target.remove();
      });
      safeQueryAll(root, "div.clear").forEach((el) => {
        if (!el.textContent.trim() && !el.querySelector("img, picture, video, iframe, table")) el.remove();
      });
      safeQueryAll(root, "[onclick], [data-ajax-success], [data-megawrap-id], [data-megaright-id]").forEach((el) => {
        ["onclick", "data-ajax-success", "data-megawrap-id", "data-megaright-id"].forEach((a) => el.removeAttribute(a));
      });
      const SITE_HOST = /^(www\.)?cnv\.org$/i;
      const FILE_EXT = /\.(pdf|docx?|xlsx?|xlsm|pptx?|zip|jpe?g|png|gif|svg|webp|mp4|mp3|csv|txt|ashx|axd)$/i;
      const sanitize = (p) => {
        const fu = typeof WebImporter !== "undefined" && WebImporter.FileUtils && WebImporter.FileUtils.sanitizePath;
        return fu ? fu(p) : p.toLowerCase();
      };
      safeQueryAll(root, "a[href]").forEach((a) => {
        const raw = a.getAttribute("href");
        if (!raw || raw.startsWith("#") || /^(mailto|tel|javascript):/i.test(raw) || raw.startsWith("//")) return;
        let u;
        try {
          u = new URL(raw, "https://www.cnv.org/");
        } catch (e) {
          return;
        }
        if (!SITE_HOST.test(u.hostname)) return;
        const isRelative = raw.startsWith("/");
        if (/^\/(-|~)\//.test(u.pathname) || FILE_EXT.test(u.pathname)) {
          if (isRelative) a.setAttribute("href", `https://www.cnv.org${u.pathname}${u.search}${u.hash}`);
          return;
        }
        const clean = u.pathname.replace(/\/+$/, "").replace(/\.aspx?$/i, "");
        let target;
        try {
          target = clean === "" ? "/" : sanitize(clean);
        } catch (e) {
          return;
        }
        a.setAttribute("href", `${target}${u.search}${u.hash}`);
      });
      safeQueryAll(root, "img[src], source[srcset]").forEach((img) => {
        ["src", "srcset"].forEach((attr) => {
          const v = img.getAttribute(attr);
          if (v && /%(?![0-9A-Fa-f]{2})/.test(v)) img.setAttribute(attr, v.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
        });
      });
      safeQueryAll(root, 'a[href=""], a:not([href])').forEach((a) => {
        a.replaceWith(...a.childNodes);
      });
      const headerText = (table) => {
        const cell = table.rows && table.rows[0] && table.rows[0].cells[0];
        return cell ? cell.textContent.replace(/\s+/g, " ").trim() : "";
      };
      const onlyWhitespaceBetween = (a, b) => {
        for (let n = a.nextSibling; n && n !== b; n = n.nextSibling) {
          if (n.nodeType === 1 || n.nodeType === 3 && n.textContent.trim()) return false;
        }
        return true;
      };
      safeQueryAll(root, "table").forEach((table) => {
        if (!table.isConnected) return;
        const name = headerText(table);
        if (!/^cards/i.test(name)) return;
        let next = table.nextElementSibling;
        while (next && next.tagName === "TABLE" && headerText(next) === name && onlyWhitespaceBetween(table, next)) {
          const body = table.tBodies[0] || table;
          Array.from(next.rows).slice(1).forEach((row) => body.appendChild(row));
          const drop = next;
          next = next.nextElementSibling;
          drop.remove();
        }
      });
    }
  }

  // tools/importer/transformers/cnv-sections.js
  var MARKER = "data-excat-section-id";
  function findSectionElement(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const document = payload && payload.document || element.ownerDocument;
    const root = element || document.body;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSectionElement(root, section);
        if (!el) continue;
        if (i === 0) {
          if (section.style) {
            const hr2 = document.createElement("hr");
            hr2.setAttribute(MARKER, section.id);
            el.parentNode.insertBefore(hr2, el);
          }
          continue;
        }
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(MARKER, section.id);
        el.parentNode.insertBefore(hr, el);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = root.querySelector(`hr[${MARKER}="${section.id}"]`);
        const anchor = marker || findSectionElement(root, section);
        if (!anchor) continue;
        const meta = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (marker) {
          let cursor = marker.nextSibling;
          let last = marker;
          while (cursor && !(cursor.nodeType === 1 && cursor.tagName === "HR")) {
            last = cursor;
            cursor = cursor.nextSibling;
          }
          last.parentNode.insertBefore(meta, last.nextSibling);
          if (i === 0) marker.remove();
          else marker.removeAttribute(MARKER);
        } else {
          anchor.parentNode.insertBefore(meta, anchor.nextSibling);
        }
      }
    }
  }

  // tools/importer/import-content-page-subsection-sidebar.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "breadcrumb": parse,
    "table-data": parse2,
    "notice": parse3
  };
  var sectionTransformers = [transform2];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var transformers = [transform, ...lateTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
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
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  var import_content_page_subsection_sidebar_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_content_page_subsection_sidebar_exports);
})();
