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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel-banner.js
  function parse(element, { document: document2 }) {
    const slides = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    slides.forEach((slide) => {
      const link = slide.querySelector(":scope > a[href]") || slide.querySelector("a[href]");
      const img = slide.querySelector("img");
      const titleEl = slide.querySelector(".contentWrapper .title");
      const subtitleEl = slide.querySelector(".contentWrapper .subtitle");
      const href = link ? link.getAttribute("href") : null;
      const imageFrag = document2.createDocumentFragment();
      if (img) {
        const image = document2.createElement("img");
        image.setAttribute("src", img.getAttribute("src"));
        image.setAttribute("alt", img.getAttribute("alt") || "");
        imageFrag.appendChild(document2.createComment(" field:media_image "));
        imageFrag.appendChild(image);
      }
      const textFrag = document2.createDocumentFragment();
      const title = titleEl ? titleEl.textContent.trim() : "";
      const subtitle = subtitleEl ? subtitleEl.textContent.trim() : "";
      if (title || subtitle || href) {
        textFrag.appendChild(document2.createComment(" field:content_text "));
        if (title) {
          const h = document2.createElement("h2");
          h.textContent = title;
          textFrag.appendChild(h);
        }
        if (subtitle) {
          const p = document2.createElement("p");
          p.textContent = subtitle;
          textFrag.appendChild(p);
        }
        if (href) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = "Learn More";
          p.appendChild(a);
          textFrag.appendChild(p);
        }
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".featureItem"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".featureImage img");
      const titleLink = item.querySelector(".featureTitle a");
      const descEl = item.querySelector(".featureDescription");
      const moreLink = item.querySelector(".learnMore a");
      const imageFrag = document2.createDocumentFragment();
      if (img) {
        const image = document2.createElement("img");
        image.setAttribute("src", img.getAttribute("src"));
        image.setAttribute("alt", img.getAttribute("alt") || "");
        imageFrag.appendChild(document2.createComment(" field:image "));
        imageFrag.appendChild(image);
      }
      const textFrag = document2.createDocumentFragment();
      textFrag.appendChild(document2.createComment(" field:text "));
      if (titleLink) {
        const h = document2.createElement("h3");
        const a = document2.createElement("a");
        a.setAttribute("href", titleLink.getAttribute("href"));
        a.textContent = titleLink.textContent.trim();
        h.appendChild(a);
        textFrag.appendChild(h);
      }
      const desc = descEl ? descEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc;
        textFrag.appendChild(p);
      }
      if (moreLink) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", moreLink.getAttribute("href"));
        a.textContent = moreLink.textContent.trim();
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".eventItem"));
    const cells = [];
    const clean = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    items.forEach((item) => {
      const date = clean(item.querySelector(".eventDate"));
      const titleLink = item.querySelector(".eventTitle a");
      const abstract = clean(item.querySelector(".eventAbstract"));
      const moreLink = item.querySelector(".learnMore a");
      const imageCell = "";
      const textFrag = document2.createDocumentFragment();
      textFrag.appendChild(document2.createComment(" field:text "));
      if (date) {
        const p = document2.createElement("p");
        p.textContent = date;
        textFrag.appendChild(p);
      }
      if (titleLink) {
        const h = document2.createElement("h3");
        const a = document2.createElement("a");
        a.setAttribute("href", titleLink.getAttribute("href"));
        a.textContent = clean(titleLink);
        h.appendChild(a);
        textFrag.appendChild(h);
      }
      if (abstract) {
        const p = document2.createElement("p");
        p.textContent = abstract;
        textFrag.appendChild(p);
      }
      if (moreLink) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.setAttribute("href", moreLink.getAttribute("href"));
        a.textContent = clean(moreLink);
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imageCell, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-links.js
  function parse4(element, { document: document2 }) {
    const buildColumn = (col) => {
      const frag = document2.createDocumentFragment();
      if (!col) return frag;
      const titleEl = col.querySelector(".links-title");
      const title = titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
      if (title) {
        const h = document2.createElement("h2");
        h.textContent = title;
        frag.appendChild(h);
      }
      const links = Array.from(col.querySelectorAll("a[href]")).filter((a) => !(titleEl && titleEl.contains(a)));
      if (links.length) {
        const ul = document2.createElement("ul");
        links.forEach((link) => {
          const li = document2.createElement("li");
          const a = document2.createElement("a");
          a.setAttribute("href", link.getAttribute("href"));
          a.textContent = link.textContent.replace(/\s+/g, " ").trim();
          li.appendChild(a);
          ul.appendChild(li);
        });
        frag.appendChild(ul);
      }
      return frag;
    };
    const wide = element.querySelector(":scope > .column-wide");
    const narrow = element.querySelector(":scope > .column-narrow");
    const cells = [[buildColumn(wide), buildColumn(narrow)]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cnv-cleanup.js
  function isEmpty(el) {
    if (!el) return false;
    if (el.querySelector("img, picture, video, iframe, a[href], input, table")) return false;
    return el.textContent.replace(/ /g, " ").trim() === "";
  }
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "#mainform > div:nth-child(8):not(#content-columns):not(#footer-background)",
        "#mainform > div.container"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#footer-background",
        "div.footer-middle-section"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".aspNetHidden",
        "div.clear"
      ]);
      WebImporter.DOMUtils.remove(element, [".slideshowPager"]);
      WebImporter.DOMUtils.remove(element, [
        "#google_translate_element",
        "#goog-gt-tt",
        ".skiptranslate",
        '[class^="VIpgJd-"]',
        "iframe"
      ]);
      element.querySelectorAll(".home-page-content .infoPanel").forEach((panel) => {
        if (isEmpty(panel)) panel.remove();
      });
      element.querySelectorAll(".home-page-content h1").forEach((h1) => {
        if (isEmpty(h1)) h1.remove();
      });
      element.querySelectorAll(".home-page-content .featureCTAs").forEach((el) => {
        if (isEmpty(el)) el.remove();
      });
      element.querySelectorAll(".homeNewsPanel .firstLineTitle").forEach((title) => {
        const h2 = element.ownerDocument.createElement("h2");
        h2.textContent = title.textContent.trim();
        title.replaceWith(h2);
      });
    }
    if (hookName === "afterTransform") {
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style",
        "noscript",
        "link",
        "iframe",
        "form#goog-gt-votingForm",
        ".widgetsAfterContent"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const n = attr.name;
          if (n.startsWith("data-track") || n.startsWith("data-analytics") || n === "onclick" || n === "onload") {
            el.removeAttribute(n);
          }
        });
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
    const doc = element.ownerDocument || document;
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = findSectionElement(element, section);
        if (!el || !el.parentNode) continue;
        if (i > 0) {
          const hr = doc.createElement("hr");
          if (section.style) hr.setAttribute(MARKER, section.id);
          el.parentNode.insertBefore(hr, el);
        } else if (section.style) {
          const hr = doc.createElement("hr");
          hr.setAttribute(MARKER, section.id);
          hr.setAttribute("data-excat-first-section", "true");
          el.parentNode.insertBefore(hr, el);
        }
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const marker = element.querySelector(`hr[${MARKER}="${section.id}"]`);
        if (section.style) {
          const metadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          const next = sections[i + 1];
          const nextMarker = next ? element.querySelector(`hr[${MARKER}="${next.id}"]`) : null;
          let placed = false;
          if (nextMarker && nextMarker.parentNode) {
            nextMarker.parentNode.insertBefore(metadata, nextMarker);
            placed = true;
          } else {
            const sectionEl = findSectionElement(element, section);
            if (sectionEl && sectionEl.parentNode) {
              sectionEl.after(metadata);
              placed = true;
            } else if (marker && marker.parentNode) {
              marker.after(metadata);
              placed = true;
            }
          }
          if (!placed) element.append(metadata);
        }
      }
      element.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => {
        if (hr.hasAttribute("data-excat-first-section")) {
          hr.remove();
        } else {
          hr.removeAttribute(MARKER);
        }
      });
    }
  }

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    name: "home",
    urls: ["https://www.cnv.org/"],
    representativeUrl: "https://www.cnv.org/",
    description: "City of North Vancouver homepage: rotating banner, feature boxes, news list and quick links",
    urlPattern: "/",
    blocks: [
      { name: "carousel-banner", instances: ["#home-top-banner .banners", "#banners"] },
      { name: "cards-feature", instances: [".homeCTAs"] },
      { name: "cards-news", instances: [".homeNewsPanel > div:has(.eventItem)"] },
      { name: "columns-links", instances: [".home-links"] }
    ],
    sections: [
      {
        id: "rc5",
        name: "Home Banner Slideshow",
        selector: ["#home-banner-background", "#home-top-banner"],
        style: null,
        blocks: ["carousel-banner"],
        defaultContent: []
      },
      {
        id: "rc6",
        name: "Feature Boxes",
        selector: ["#content-columns > div.container:has(.homeCTAs)", "#content-columns > div.container:nth-of-type(3)"],
        style: null,
        blocks: ["cards-feature"],
        defaultContent: []
      },
      {
        id: "rc8",
        name: "News, Quick Links and Council Meetings",
        selector: ["#content-columns > div.container:has(.homeNewsPanel)", "#content-columns > div.container:nth-of-type(5)"],
        style: null,
        blocks: ["cards-news", "columns-links"],
        defaultContent: [".homeNewsPanel .firstLineTitle"]
      }
    ]
  };
  var parsers = {
    "carousel-banner": parse,
    "cards-feature": parse2,
    "cards-news": parse3,
    "columns-links": parse4
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
  function findBlocksOnPage(document2, template, url) {
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
        matches = document2.querySelectorAll(selector);
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
    const { document: document2, params } = payload;
    executeTransformers("beforeTransform", document2.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document2, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document2.querySelector(s);
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
  var import_home_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document2.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document: document2, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document2.createElement("hr"));
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document2);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_home_exports);
})();
