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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel.js
  function cleanText(node) {
    return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function parse(element, { document }) {
    const banners = element.querySelector("#banners, .banners") || element;
    const slides = Array.from(banners.querySelectorAll(":scope > div")).filter((s) => s.querySelector("img"));
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      const link2 = slide.querySelector("a[href]");
      const href = link2 ? link2.getAttribute("href") : "";
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      const image = document.createElement("img");
      image.setAttribute("src", img.getAttribute("src"));
      image.setAttribute("alt", img.getAttribute("alt") || "");
      imageCell.appendChild(image);
      const nodes = [];
      const title = cleanText(slide.querySelector(".contentWrapper .title"));
      const subtitle = cleanText(slide.querySelector(".contentWrapper .subtitle"));
      if (title) {
        const h = document.createElement("h2");
        h.textContent = title;
        nodes.push(h);
      }
      if (subtitle) {
        const p = document.createElement("p");
        p.textContent = subtitle;
        nodes.push(p);
      }
      if (href) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = "Learn More";
        p.appendChild(a);
        nodes.push(p);
      }
      let textCell = "";
      if (nodes.length) {
        textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(" field:content_text "));
        nodes.forEach((n) => textCell.appendChild(n));
      }
      const box = slide.querySelector(".contentWrapper");
      const cls = box ? Array.from(box.classList) : [];
      const position = cls.includes("topright") ? "top-right" : cls.includes("bottomright") ? "bottom-right" : cls.includes("top") || cls.includes("topleft") ? "top-left" : cls.includes("bottom") || cls.includes("bottomleft") ? "bottom-left" : "bottom-right";
      const style = box ? box.getAttribute("style") || "" : "";
      const width = (style.match(/(?:^|;)\s*width\s*:\s*(\d+)px/i) || [])[1] || "";
      const alpha = (style.match(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/i) || [])[1];
      const opacity = alpha !== void 0 ? String(Math.round(parseFloat(alpha) * 100)) : "";
      const setting = (name, value) => {
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(` field:${name} `));
        if (value) frag.appendChild(document.createTextNode(value));
        return frag;
      };
      cells.push([
        imageCell,
        textCell,
        setting("overlayPosition", position),
        setting("overlayWidth", width),
        setting("overlayOpacity", opacity)
      ]);
    });
    if (!cells.length) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/breadcrumb.js
  function parse2(element, { document }) {
    if (!element.matches("#breadcrumbs-navigation") && !element.closest("#breadcrumbs-navigation")) return;
    const ul = document.createElement("ul");
    const items = Array.from(element.querySelectorAll("ul > li"));
    items.forEach((item) => {
      const li = document.createElement("li");
      const link2 = item.querySelector("a[href]");
      if (link2) {
        const a = document.createElement("a");
        a.setAttribute("href", link2.getAttribute("href"));
        a.textContent = link2.textContent.trim();
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

  // tools/importer/parsers/cards-feature.js
  var FA_NON_ICON = /^fa-(regular|solid|light|thin|duotone|sharp|brands|fw|lg|xs|sm|\d+x)$/;
  function iconToken(scope) {
    const icon = scope.querySelector('i[class*="fa-"], em[class*="fa-"], span[class*="fa-"]');
    if (!icon) return null;
    const name = Array.from(icon.classList).find((c) => c.startsWith("fa-") && !FA_NON_ICON.test(c));
    return name ? `:${name}:` : null;
  }
  function cleanText2(node) {
    return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function makeLink(document, href, text) {
    if (!href) return document.createTextNode(text);
    const a = document.createElement("a");
    a.setAttribute("href", href);
    a.textContent = text;
    return a;
  }
  function buildImageCell(document, img) {
    if (!img) return "";
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(" field:image "));
    const image = document.createElement("img");
    image.setAttribute("src", img.getAttribute("src"));
    image.setAttribute("alt", img.getAttribute("alt") || "");
    frag.appendChild(image);
    return frag;
  }
  function buildTextCell(document, nodes) {
    const content = nodes.filter(Boolean);
    if (!content.length) return "";
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(" field:text "));
    content.forEach((n) => frag.appendChild(n));
    return frag;
  }
  function parseGridTile(document, tile) {
    const nodes = [];
    const token = iconToken(tile);
    if (token) {
      const p = document.createElement("p");
      p.textContent = token;
      nodes.push(p);
    }
    const title = cleanText2(tile.querySelector(".grid-item-title")) || cleanText2(tile);
    if (title) {
      const p = document.createElement("p");
      p.appendChild(makeLink(document, tile.getAttribute("href"), title));
      nodes.push(p);
    }
    return [buildImageCell(document, tile.querySelector("img")), buildTextCell(document, nodes)];
  }
  function parseFeatureItem(document, item) {
    const nodes = [];
    const img = item.querySelector("img");
    if (!img) {
      const token = iconToken(item);
      if (token) {
        const p = document.createElement("p");
        p.textContent = token;
        nodes.push(p);
      }
    }
    const titleEl = item.querySelector(".featureTitle");
    const titleText = cleanText2(titleEl);
    const titleLink = titleEl && titleEl.querySelector("a[href]");
    if (titleText) {
      const h = document.createElement("h3");
      h.appendChild(makeLink(document, titleLink && titleLink.getAttribute("href"), titleText));
      nodes.push(h);
    }
    const desc = item.querySelector(".featureDescription");
    if (desc && cleanText2(desc)) {
      const p = document.createElement("p");
      p.textContent = cleanText2(desc);
      nodes.push(p);
    }
    const learnMore = item.querySelector(".learnMore a[href]");
    item.querySelectorAll("p").forEach((para) => {
      if (para.closest(".featureTitle, .featureDescription, .learnMore")) return;
      const text = cleanText2(para);
      if (!text) return;
      const link2 = para.querySelector("a[href]");
      const p = document.createElement("p");
      if (link2 && cleanText2(link2) === text) {
        p.appendChild(makeLink(document, link2.getAttribute("href"), text.replace(/^>\s*/, "")));
      } else {
        p.textContent = text;
      }
      nodes.push(p);
    });
    if (learnMore && cleanText2(learnMore)) {
      const p = document.createElement("p");
      p.appendChild(makeLink(document, learnMore.getAttribute("href"), cleanText2(learnMore)));
      nodes.push(p);
    }
    return [buildImageCell(document, img), buildTextCell(document, nodes)];
  }
  function parse3(element, { document }) {
    const cells = [];
    const featureItems = Array.from(element.querySelectorAll(".featureItem"));
    if (featureItems.length) {
      featureItems.forEach((item) => cells.push(parseFeatureItem(document, item)));
    } else {
      let tiles = Array.from(element.querySelectorAll(".featured-grid > a"));
      if (!tiles.length) tiles = Array.from(element.querySelectorAll(":scope > a"));
      tiles.forEach((tile) => cells.push(parseGridTile(document, tile)));
    }
    if (!cells.length) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-news.js
  function cleanText3(node) {
    return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function link(document, a, text) {
    const el = document.createElement("a");
    el.setAttribute("href", a.getAttribute("href"));
    el.textContent = text || cleanText3(a);
    return el;
  }
  function linksCell(document, column) {
    const nodes = [];
    const title = cleanText3(column.querySelector(".links-title"));
    if (title) {
      const h = document.createElement("h2");
      h.textContent = title;
      nodes.push(h);
    }
    const ul = document.createElement("ul");
    column.querySelectorAll("a[href]").forEach((a) => {
      const text = cleanText3(a);
      if (!text) return;
      const li = document.createElement("li");
      li.appendChild(link(document, a, text));
      ul.appendChild(li);
    });
    if (ul.children.length) nodes.push(ul);
    return nodes;
  }
  function field(document, name, value) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    frag.appendChild(document.createTextNode(String(value)));
    return frag;
  }
  function newsFeedBlock(document, panel) {
    const title = cleanText3(panel.querySelector(".firstLineTitle"));
    const count = panel.querySelectorAll(".eventItem").length || 4;
    if (!title && !panel.querySelector(".eventItem")) return null;
    return WebImporter.Blocks.createBlock(document, {
      name: "news-feed",
      cells: [[field(document, "title", title)], [field(document, "limit", count)]]
    });
  }
  function parse4(element, { document }) {
    const newsPanel = element.querySelector(".homeNewsPanel");
    const feed = newsPanel ? newsFeedBlock(document, newsPanel) : null;
    const rows = [];
    const linkColumns = Array.from(element.querySelectorAll(".home-links > div")).map((col) => linksCell(document, col)).filter((nodes) => nodes.length);
    if (linkColumns.length) rows.push(linkColumns);
    const out = [];
    if (feed) out.push(feed);
    if (rows.length) {
      const width = Math.max(2, ...rows.map((r) => r.length));
      const cells = rows.map((r) => r.length < width ? r.concat(Array(width - r.length).fill("")) : r);
      out.push(WebImporter.Blocks.createBlock(document, { name: "columns (news)", cells }));
    }
    if (!out.length) return;
    element.replaceWith(...out);
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
      const pageUrls = getPageUrl(payload, element);
      const isNewsRoom = pageUrls.some((u) => {
        try {
          return /^\/city-hall\/news-room(\/|$)/i.test(new URL(u, "https://www.cnv.org").pathname);
        } catch (e) {
          return false;
        }
      });
      const sideNav = root.querySelector("#left-side-navigation");
      if (isNewsRoom && sideNav && payload.params) {
        const toPath = (href) => {
          try {
            const u = new URL(href, "https://www.cnv.org/");
            const p = u.pathname.replace(/\/+$/, "");
            const fu = typeof WebImporter !== "undefined" && WebImporter.FileUtils && WebImporter.FileUtils.sanitizePath;
            return p ? fu ? fu(p) : p.toLowerCase() : "/";
          } catch (e) {
            return href;
          }
        };
        const titleLink = sideNav.querySelector(".navigation-title a[href]");
        const items = [...sideNav.querySelectorAll(".side-nav > ul > li > a[href], ul > li > a[href]")].filter((a, i, all) => all.indexOf(a) === i && !a.closest("li li"));
        if (titleLink && items.length) {
          const holder = document.createElement("div");
          const section = document.createElement("div");
          const h3 = document.createElement("h3");
          const ta = document.createElement("a");
          ta.setAttribute("href", toPath(titleLink.getAttribute("href")));
          ta.textContent = titleLink.textContent.replace(/\s+/g, " ").trim();
          h3.append(ta);
          const ul = document.createElement("ul");
          items.forEach((a) => {
            const li = document.createElement("li");
            const link2 = document.createElement("a");
            link2.setAttribute("href", toPath(a.getAttribute("href")));
            link2.textContent = a.textContent.replace(/\s+/g, " ").trim();
            li.append(link2);
            ul.append(li);
          });
          section.append(h3, ul);
          holder.append(section);
          payload.params.fragments = payload.params.fragments || [];
          const isNewsRoomMenu = ta.getAttribute("href").toLowerCase() === "/city-hall/news-room";
          if (isNewsRoomMenu && !payload.params.fragments.some((f) => f.path === "/fragments/news-room-nav")) {
            payload.params.fragments.push({ element: holder, path: "/fragments/news-room-nav" });
          }
          payload.params.extraMetadata = __spreadProps(__spreadValues({}, payload.params.extraMetadata || {}), { template: "news" });
        }
      }
      const isNewsArticle = pageUrls.some((u) => {
        try {
          return /^\/city-hall\/news-room\/[^/]+\/\d{4}\/\d{1,2}\/\d{1,2}\/[^/]+/i.test(new URL(u, "https://www.cnv.org").pathname);
        } catch (e) {
          return false;
        }
      });
      if (isNewsArticle && payload.params) {
        const para = [...element.querySelectorAll("p")].filter((p) => !p.closest("table") && !p.closest("#left-side-column, #left-side-navigation, #postHeader")).map((p) => p.textContent.replace(/\s+/g, " ").trim()).find((t) => t.split(" ").length >= 8);
        if (para) {
          const max = 220;
          const text = para.length > max ? `${para.slice(0, para.lastIndexOf(" ", max))}\u2026` : para;
          payload.params.extraMetadata = __spreadProps(__spreadValues({}, payload.params.extraMetadata || {}), { Description: text });
        }
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
      safeQueryAll(root, "img[src]").forEach((img) => {
        const v = img.getAttribute("src");
        if (v && /[()]/.test(v)) img.setAttribute("src", v.replace(/\(/g, "%28").replace(/\)/g, "%29"));
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

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
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
  var parsers = {
    "carousel": parse,
    "breadcrumb": parse2,
    "cards-feature": parse3,
    "columns-news": parse4
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
