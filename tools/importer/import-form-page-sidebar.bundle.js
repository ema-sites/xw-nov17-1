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

  // tools/importer/import-form-page-sidebar.js
  var import_form_page_sidebar_exports = {};
  __export(import_form_page_sidebar_exports, {
    default: () => import_form_page_sidebar_default
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
  function parse2(element, { document }) {
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

  // tools/importer/parsers/form.js
  var TYPE_MAP = {
    text: "text",
    textarea: "textarea",
    multilinetext: "textarea",
    email: "email",
    tel: "tel",
    telephone: "tel",
    date: "date",
    number: "number",
    select: "select",
    dropdownlist: "select",
    dropdown: "select",
    radiolist: "radio",
    radio: "radio",
    checkboxlist: "checkbox",
    checkbox: "checkbox"
  };
  var AUTOCOMPLETE = [
    [/e-?mail/i, "email"],
    [/phone|telephone|\btel\b|cell/i, "tel"],
    [/postal|zip/i, "postal-code"],
    [/suite|unit|apartment|apt\b|address line 2/i, "address-line2"],
    [/street|address/i, "address-line1"],
    [/^\s*(your\s+)?city\b|municipality/i, "address-level2"],
    [/province|state\b/i, "address-level1"],
    [/organi[sz]ation|company|business name/i, "organization"],
    [/(^|\s)(full\s+)?name\b|first and last name/i, "name"]
  ];
  function clean(node) {
    return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
  }
  function autocompleteFor(label, type) {
    if (type === "email") return "email";
    if (type === "tel") return "tel";
    if (!["text", "textarea", "select"].includes(type)) return "";
    const hit = AUTOCOMPLETE.find(([re]) => re.test(label));
    return hit ? hit[1] : "";
  }
  function cell(document, name, value) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${name} `));
    if (value && typeof value === "object") frag.appendChild(value);
    else if (value) frag.appendChild(document.createTextNode(String(value)));
    return frag;
  }
  function optionList(document, options) {
    if (!options.length) return "";
    const ul = document.createElement("ul");
    options.forEach((o) => {
      const li = document.createElement("li");
      li.textContent = o;
      ul.appendChild(li);
    });
    return ul;
  }
  function itemRow(document, f) {
    return [
      cell(document, "label", f.label),
      cell(document, "name", ""),
      cell(document, "type", f.type),
      cell(document, "required", f.required ? "true" : "false"),
      cell(document, "options", optionList(document, f.options || [])),
      cell(document, "autocomplete", f.autocomplete || ""),
      cell(document, "help", f.help || ""),
      cell(document, "errorMessage", f.errorMessage || "")
    ];
  }
  function sitecoreField(wrapper) {
    const typeClass = Array.from(wrapper.classList).find((c) => c.startsWith("input-") && c !== "input-wrapper");
    let type = TYPE_MAP[(typeClass || "").replace("input-", "")] || "text";
    const own = (sel) => Array.from(wrapper.querySelectorAll(sel)).filter((n) => n.closest(".input-wrapper") === wrapper);
    const controls = own('input:not([type="hidden"]):not([type="submit"]), select, textarea');
    if (!controls.length) return null;
    const control = controls[0];
    if (control.tagName === "SELECT") type = "select";
    else if (control.tagName === "TEXTAREA") type = "textarea";
    else if (TYPE_MAP[control.type] && type === "text") type = TYPE_MAP[control.type];
    const labelEl = own("label").find((l) => !l.querySelector("input"));
    const label = clean(labelEl) || control.getAttribute("data-sc-field-name") || "";
    const requiredMsg = controls.map((c) => c.getAttribute("data-val-required")).find(Boolean) || "";
    let options = [];
    if (type === "select") {
      options = Array.from(control.querySelectorAll("option")).map((o) => clean(o)).filter(Boolean);
    } else if (type === "radio" || type === "checkbox") {
      options = own("label").filter((l) => l.querySelector("input")).map((l) => clean(l)).filter(Boolean);
      if (type === "checkbox" && options.length === 1 && !labelEl) options = [];
    }
    const required = !!requiredMsg || controls.some((c) => c.hasAttribute("required"));
    return {
      label,
      type,
      required,
      options,
      autocomplete: autocompleteFor(label, type),
      // keep the source message only when it differs from the block default "<label> is required."
      errorMessage: requiredMsg && requiredMsg.trim() !== `${label} is required.` ? requiredMsg.trim() : ""
    };
  }
  function mailchimpField(group) {
    const control = group.querySelector('input:not([type="hidden"]):not([type="submit"]), select, textarea');
    if (!control) return null;
    const labelEl = group.querySelector("label");
    const asterisk = labelEl && labelEl.querySelector(".asterisk");
    if (asterisk) asterisk.remove();
    const label = clean(labelEl) || control.getAttribute("placeholder") || control.getAttribute("name") || "";
    let type = control.tagName === "SELECT" ? "select" : control.tagName === "TEXTAREA" ? "textarea" : TYPE_MAP[control.type] || "text";
    const options = type === "select" ? Array.from(control.querySelectorAll("option")).map((o) => clean(o)).filter(Boolean) : [];
    return {
      label,
      type,
      required: !!asterisk || control.classList.contains("required") || control.hasAttribute("required"),
      options,
      autocomplete: autocompleteFor(label, type)
    };
  }
  function parse3(el, { document }) {
    const element = el.closest("div.mvc-form, #mc_embed_signup") || el;
    const formEl = element.querySelector("[action], form") || element;
    const isMailchimp = element.matches("#mc_embed_signup") || !!element.querySelector(".mc-field-group");
    const fieldSel = isMailchimp ? ".mc-field-group" : ".input-wrapper";
    const submitEl = formEl.querySelector('input[type="submit"], button[type="submit"], button:not([type])');
    const beforeSubmit = (n) => !submitEl || !!(n.compareDocumentPosition(submitEl) & 4);
    const nodes = Array.from(formEl.querySelectorAll(`${fieldSel}, h1, h2, h3, h4, h5, h6, p`)).filter((n) => beforeSubmit(n) && !n.closest("#footer, #footer-background, footer, .footer-middle-section"));
    const firstFieldIndex = nodes.findIndex((n) => n.matches(fieldSel));
    const items = [];
    const intro = [];
    nodes.forEach((node, i) => {
      if (node.matches(fieldSel)) {
        const f = isMailchimp ? mailchimpField(node) : sitecoreField(node);
        if (f && f.label) items.push(f);
        return;
      }
      if (node.closest("label, .g-recaptcha, .validation-summary-errors, .mc-field-group, .indicates-required")) return;
      if (node.closest(fieldSel) && !node.matches("h1, h2, h3, h4, h5, h6, p")) return;
      const text = clean(node);
      if (!text) return;
      if (firstFieldIndex === -1 || i < firstFieldIndex) {
        intro.push(node);
        return;
      }
      const big = /font-size:\s*(1[8-9]|[2-9]\d)px/i.test(node.getAttribute("style") || "");
      items.push({ label: text, type: /^H[1-6]$/.test(node.tagName) || big ? "heading" : "note" });
    });
    intro.forEach((node) => element.before(node));
    if (!items.some((f) => !["heading", "note"].includes(f.type))) {
      element.remove();
      return;
    }
    const submitLabel = submitEl ? (submitEl.getAttribute("value") || clean(submitEl) || "Submit").trim() : "Submit";
    const cells = [
      [cell(document, "submitLabel", submitLabel)],
      [""],
      [""],
      ...items.map((f) => itemRow(document, f))
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  var NON_CONTENT = /recaptcha|video_blank\.html|about:blank/i;
  function parse4(element, { document }) {
    const frames = [element.matches("iframe") ? element : null, ...element.querySelectorAll("iframe")].filter(Boolean).filter((f) => {
      const src2 = f.getAttribute("src") || f.getAttribute("data-src") || "";
      return src2 && !NON_CONTENT.test(src2) && !NON_CONTENT.test(f.getAttribute("title") || "");
    });
    let src = frames.length ? frames[0].getAttribute("src") || frames[0].getAttribute("data-src") : null;
    if (!src) {
      const video = element.querySelector("video[src], video source[src]");
      if (video) src = video.getAttribute("src");
    }
    if (!src) {
      element.remove();
      return;
    }
    if (src.startsWith("//")) src = `https:${src}`;
    const title = frames.length ? (frames[0].getAttribute("title") || "").trim() : "";
    const frag = document.createDocumentFragment();
    const poster = element.querySelector("img[src]");
    if (poster) {
      frag.appendChild(document.createComment(" field:embed_placeholder "));
      const img = document.createElement("img");
      img.setAttribute("src", poster.getAttribute("src"));
      img.setAttribute("alt", poster.getAttribute("alt") || title);
      frag.appendChild(img);
    }
    frag.appendChild(document.createComment(" field:embed_uri "));
    const a = document.createElement("a");
    a.setAttribute("href", src);
    a.textContent = src;
    frag.appendChild(a);
    const cells = [[frag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-date-select.js
  var GUID = /^\{?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}?$/i;
  function pagePath(document, params) {
    const candidates = [];
    if (params && params.originalURL) candidates.push(params.originalURL);
    const og = document.querySelector('meta[property="og:url"]');
    if (og) candidates.push(og.getAttribute("content"));
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) candidates.push(canonical.getAttribute("href"));
    const form = document.querySelector("#mainform[action]");
    if (form) candidates.push(form.getAttribute("action"));
    for (const c of candidates) {
      try {
        const u = new URL(c, "https://www.cnv.org");
        if (u.pathname && u.pathname !== "/") return u.pathname.replace(/\/+$/, "");
      } catch (e) {
      }
    }
    return "";
  }
  function parse5(element, { document, params }) {
    const select = element.querySelector('select[id$="_dwnVideos"], select#location') || element.querySelector("select");
    let label = "";
    const labelEl = element.querySelector('[id$="_lblSelectDate"]');
    if (labelEl) label = labelEl.textContent;
    else if (select && select.closest("label")) {
      label = Array.from(select.closest("label").childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" ");
    } else if (select && select.previousElementSibling && /^(SPAN|LABEL|STRONG)$/.test(select.previousElementSibling.tagName)) {
      label = select.previousElementSibling.textContent;
    }
    label = label.replace(/\s+/g, " ").trim() || "Select a Date:";
    const base = pagePath(document, params);
    const ul = document.createElement("ul");
    if (select) {
      Array.from(select.querySelectorAll("option")).forEach((opt) => {
        const text = opt.textContent.replace(/\s+/g, " ").trim();
        const value = (opt.getAttribute("value") || "").trim();
        if (!text || !value) return;
        if (/^select a date/i.test(text) || /^\{?0{8}-0{4}-0{4}-0{4}-0{12}\}?$/.test(value) || /video_blank\.html/i.test(value)) return;
        let href;
        const m = value.match(GUID);
        if (m) href = `${base}?videoid=${m.slice(1).join("").toLowerCase()}`;
        else if (/^(https?:)?\/\//i.test(value) || value.startsWith("/")) href = value;
        else return;
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = text;
        li.appendChild(a);
        ul.appendChild(li);
      });
    }
    const cells = [];
    const labelFrag = document.createDocumentFragment();
    labelFrag.appendChild(document.createComment(" field:label "));
    labelFrag.appendChild(document.createTextNode(label));
    cells.push([labelFrag]);
    if (ul.children.length) {
      const videosFrag = document.createDocumentFragment();
      videosFrag.appendChild(document.createComment(" field:videos "));
      videosFrag.appendChild(ul);
      cells.push([videosFrag]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "video-date-select", cells });
    if (select && element.contains(select)) {
      const ownText = (el) => el ? el.textContent.replace(/\s+/g, " ").trim() : "";
      const allowed = ownText(labelEl) + ownText(select.closest("label") || select);
      let target = select.closest("label") || select;
      if (labelEl && !target.contains(labelEl)) {
        while (target.parentElement && target.parentElement !== element && !target.contains(labelEl)) {
          target = target.parentElement;
        }
        if (!target.contains(labelEl)) target = null;
      }
      while (target && target.parentElement && target.parentElement !== element && ownText(target.parentElement).length <= allowed.length + 2) {
        target = target.parentElement;
      }
      if (target && target !== element) {
        if (labelEl && !target.contains(labelEl)) labelEl.remove();
        target.replaceWith(block);
        return;
      }
    }
    element.replaceWith(block);
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
            const link = document.createElement("a");
            link.setAttribute("href", toPath(a.getAttribute("href")));
            link.textContent = a.textContent.replace(/\s+/g, " ").trim();
            li.append(link);
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
        const clean2 = u.pathname.replace(/\/+$/, "").replace(/\.aspx?$/i, "");
        let target;
        try {
          target = clean2 === "" ? "/" : sanitize(clean2);
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
        const cell2 = table.rows && table.rows[0] && table.rows[0].cells[0];
        return cell2 ? cell2.textContent.replace(/\s+/g, " ").trim() : "";
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

  // tools/importer/import-form-page-sidebar.js
  var PAGE_TEMPLATE = {
    "name": "form-page-sidebar",
    "urls": [
      "https://www.cnv.org/City-Hall/Contact/Have-Your-Say",
      "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings",
      "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Sign-Up",
      "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration",
      "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Invite-the-Mayor",
      "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Request-a-Certificate",
      "https://www.cnv.org/City-Hall/Online-Services/Service-Request",
      "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program",
      "https://www.cnv.org/Parks-Recreation/Public-Spaces/Musician",
      "https://www.cnv.org/Parks-Recreation/Public-Spaces/Venue-Booking-Application"
    ],
    "description": "Inner page with hero banner, breadcrumb, left section navigation plus promo panels in the sidebar, and a main column holding an input form with the footer contained inside the content column",
    "blocks": [
      {
        "name": "breadcrumb",
        "instances": [
          "#breadcrumbs-navigation"
        ],
        "pageInstances": {
          "https://www.cnv.org/City-Hall/Contact/Have-Your-Say": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Sign-Up": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Invite-the-Mayor": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Request-a-Certificate": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/City-Hall/Online-Services/Service-Request": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/Parks-Recreation/Public-Spaces/Musician": [
            "#breadcrumbs-navigation"
          ],
          "https://www.cnv.org/Parks-Recreation/Public-Spaces/Venue-Booking-Application": [
            "#breadcrumbs-navigation"
          ]
        }
      },
      {
        "name": "notice",
        "instances": [
          ".content-section > div.call-out-info.call-out-icon"
        ],
        "pageInstances": {
          "https://www.cnv.org/City-Hall/Contact/Have-Your-Say": [
            "#phcontent_0_phwidgetscontent_0_ctl02_pnlEventsWidget"
          ],
          "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings": [
            "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
          ],
          "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program": [
            "#phcontent_0_phcontentsections_0_pnlContentSection > div.call-out-info.call-out-icon"
          ]
        }
      },
      {
        "name": "form",
        "instances": [
          "div.mvc-form",
          "#mc_embed_signup"
        ],
        "pageInstances": {
          "https://www.cnv.org/City-Hall/Contact/Have-Your-Say": [
            "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_efb56978-577f-4d14-aa5f-0036341cfe29__Value",
            "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_fadd6c4c-c17d-405d-ae6a-236476c3c561__Value",
            "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_05355e33-356a-4bd0-94c2-e9fa48caa4b7__Value",
            "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_7ce7f01d-bd55-4dc5-b07f-fe603041cb48__Value",
            "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_Fields_913404aa-7d7e-4499-8caf-a4572252a361__Value",
            "#fxb_92477ff1-94dd-4d28-b42c-faa6ccede87f_1614d3bc-984a-42ef-9404-f0243f3e437d > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(14)"
          ],
          "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings": [
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_0eec599e-1f35-446c-a7c6-0bd7aaf8c809__Value",
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_23374727-6ccd-4174-8d41-4cc10c536508__Value",
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_63f70f4d-b41a-4439-8ebf-cd23e5a435c0__Value",
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_3a8872bf-13f2-4e32-aa63-7216d6eac160__Value",
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_bfad372c-8d93-4d84-9c5f-acf99e176549__Value",
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_9c98e7d3-d8d2-4176-a78c-d27e507f524b__Value",
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_ca27eae2-be45-4d6c-8a83-06526b7a36e0__Value",
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_Fields_6195c3d7-a148-4df2-b444-11414a8905dd__Value",
            "#fxb_8aada3dd-43da-4a14-a82a-017bfd8ac10f_0d8787b4-5cce-45b5-a1f4-7074afbbdb85 > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(17)"
          ],
          "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Sign-Up": [
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_0eec599e-1f35-446c-a7c6-0bd7aaf8c809__Value",
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_23374727-6ccd-4174-8d41-4cc10c536508__Value",
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_63f70f4d-b41a-4439-8ebf-cd23e5a435c0__Value",
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_3a8872bf-13f2-4e32-aa63-7216d6eac160__Value",
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_bfad372c-8d93-4d84-9c5f-acf99e176549__Value",
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_9c98e7d3-d8d2-4176-a78c-d27e507f524b__Value",
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_ca27eae2-be45-4d6c-8a83-06526b7a36e0__Value",
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_Fields_6195c3d7-a148-4df2-b444-11414a8905dd__Value",
            "#fxb_f36ce1c2-ad5b-47a1-acfb-60e2523f03b0_0d8787b4-5cce-45b5-a1f4-7074afbbdb85 > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(17)"
          ],
          "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration": [
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_5075b8a7-4751-4188-8ad5-3a73f415f46a__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_da013ca2-a60c-4b09-83ee-66e9e9b73875__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_24c668cf-0ad3-4de2-88b9-5d2fa39ce020__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_1b860325-f86c-4bc7-bf2a-8ef449bb622a__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_65d3cacc-34d0-4aca-8755-2e3803e47f13__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_03d31fb4-3cf5-4f35-8ce3-5ec402cc1058__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_e2ee9e9d-eb86-4915-8711-e492a261b7e5__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_3e1e4b5e-c5ab-4c83-91d3-67d562f83570__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_346906c7-8b1a-4818-bd31-ac5d4d0a2405__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_Fields_d518b99a-e49c-4a85-a449-b2bff4d8fb38__Value",
            "#fxb_ddd624dd-8357-4262-807e-1d0a885974d5_03a3bf74-1e87-45bc-9f5b-9d515e31b05a > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(14)"
          ],
          "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Invite-the-Mayor": [
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_a5e56ccd-ab96-43da-befe-9762f53cca61__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_ce3c5a71-0d8c-41f5-968c-7a5784df97d3__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_2b7b6f94-c9a7-4212-8246-3d552f5c46b8__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_27389893-f540-4776-9b5c-1384a3efcad3__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_69c72009-fcd3-47ce-a61e-aaea6c5bd18a__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_9591a971-ea9d-469d-ad32-61923229a9cf__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_6543dc4e-fc29-4da7-9c2f-0ab284a0dd6c__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_903d75b4-7d8a-4ee0-abdf-52d266e65ea2__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_1702233d-4e01-4d80-9088-be33b0c73d99__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_ea91410f-e0ef-4015-bdc9-1bde5cf8bd52__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_257d84e0-4370-4314-a293-64db62f7a592__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_383729a6-4235-4889-b31d-f6ed039bca70__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > div:nth-child(6) > label:nth-child(2)",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > div:nth-child(6) > label:nth-child(3)",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > div:nth-child(9) > label:nth-child(2)",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > div:nth-child(9) > label:nth-child(3)",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_Fields_c3dac9e0-34b5-4903-8c46-4ae4ddc5ce6e__Value",
            "#fxb_e7d63624-ff7a-4a6e-b8f5-ddca4c5a7033_5c1ff12c-0091-467a-9928-b6f446414e4c > div > div > div > div > div > div > div:nth-child(4) > div.input-wrapper.input-text > div:nth-child(4) > div > div:nth-child(4) > div > div > div > div > input[type=submit]:nth-child(21)"
          ],
          "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Request-a-Certificate": [
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_dab36164-f7a1-4378-8028-1d184afc3266__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_b656ae99-f753-40f7-a215-a76a3d033fcc__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_dce9464d-8b30-43fa-9558-829af70eda85__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_f7707df3-af27-45e5-a51b-4984edccc3ee__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_9786e8a2-03d9-455a-8a73-d9f1b9341f7b__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_954c2c7f-bd2e-41a8-96dd-0e52dc73744f__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_f4d4aac6-faca-4480-affc-c695340db411__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_fefcdbd3-fc10-49aa-be98-85be5c1a1357__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_4d3683b8-038a-49a5-8e96-b492222cfce0__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_Fields_50ccf67d-0ed9-44d1-83be-8bb5426d8340__Value",
            "#fxb_403c5c83-944f-40d1-81cd-0a293c8a9ac6_0aad9b46-ec30-4fac-92d4-6d4cf134e08e > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(8)"
          ],
          "https://www.cnv.org/City-Hall/Online-Services/Service-Request": [
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(2)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(3)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(4)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(5)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(6)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(7)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(8)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(9)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(10)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(11)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-radiolist > label:nth-child(12)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_21752b05-dc7a-401b-83c5-11d62a4c6f77__Value",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_0197c3cc-7bf9-4b65-8b72-3318a375f059__Value",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_e68b8277-39e2-44a1-b690-3f88a71e2574__Value",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_618dc846-2158-4d45-8540-e2722c1bd947__Value",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_ed9d413c-8553-4050-8ec3-d4359036290f__Value",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_54b63997-fde2-4be5-a6bd-40d694ed3d87__Value",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_Fields_4cbc7471-82b0-480e-ba97-eae8811b7770__Value",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div.input-wrapper.input-radiolist > label:nth-child(2)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div.input-wrapper.input-radiolist > label:nth-child(3)",
            "#fxb_52bc5610-e036-48ac-ae2a-1b716177d402_13caab63-77fc-4534-b0b7-375ce7dcdbe0 > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > input[type=submit]:nth-child(18)"
          ],
          "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program": [
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_77d8932b-c075-4206-a77f-7d07ebba5a52__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_00735ba3-25a6-4ff1-910a-37b3fbf438b0__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_78d8969e-bdd1-4a7f-a2f9-0bd71598b0a9__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_1eb7d151-3465-4009-9d4c-bcde4765ddd4__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div:nth-child(9) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div:nth-child(9) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div:nth-child(13) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div:nth-child(13) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_7ea1e046-a01a-46f5-ab25-3ddd9a22eb5a__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_f71a1a33-d5a8-4180-b371-c77f2d6cab77__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div:nth-child(3) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div:nth-child(3) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div:nth-child(6) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div:nth-child(6) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_7a8939b4-57ff-4b68-aa4c-78ec65254416__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-radiolist > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-radiolist > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_93f41f89-7c10-4327-a829-09f577d5d5fd__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_99266eff-fbe5-468c-8477-df7ad67eb263__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(4)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(5)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(6)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(7)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(8)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(9)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-checkboxlist > label:nth-child(10)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(9) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(9) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(12) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(12) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(15) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(15) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(18) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(18) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(21) > label:nth-child(2)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div:nth-child(21) > label:nth-child(3)",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_Fields_6f59002e-ac03-4556-83a5-389b43f31104__Value",
            "#fxb_f95b3dc4-c3ff-42a3-b993-b58b90456a0e_b090f68f-7586-4ef0-8989-4a0c2b1fae4a > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(32)"
          ],
          "https://www.cnv.org/Parks-Recreation/Public-Spaces/Musician": [
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_1b57477b-5ef7-47cb-8495-7d50d6f9a2c2__Value",
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_4078ba2e-cc76-4ed9-a89d-6690aca92619__Value",
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_bc9eb17a-66e0-4050-99ed-8e7c36f408c2__Value",
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_60d83127-a64b-47af-ae43-c48114cf7b46__Value",
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_a5596847-f7b8-429b-a49a-c6f3c9e70132__Value",
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_d28bc70c-96fd-4248-acbb-4fb9db26cc04__Value",
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_c6c51ea2-a8c5-49d8-9828-68b991f29909__Value",
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_Fields_14f9f43b-3ccb-48cf-b6f1-92ef26270e3b__Value",
            "#fxb_edef53a0-f919-4532-90cb-9a2b17458597_f3aa4dfa-9333-4756-b5bd-de2c24cafa5b > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > input[type=submit]:nth-child(8)"
          ],
          "https://www.cnv.org/Parks-Recreation/Public-Spaces/Venue-Booking-Application": [
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_0292be33-f7ea-4983-a63d-e90fd360afb8__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_9a061395-2dc2-4370-8682-84d1fed8fe7e__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_7861f8fa-c071-4032-8d4f-225228117c0d__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_0b19fa7c-9b4a-4bc0-b79d-086ee20bc971__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_2b251a11-de62-4b14-9d69-8ac6e3760ea3__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_60bac1d1-fe88-4b99-a240-78f0ea9afd6a__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_cb67e57e-0bcb-46a9-92fd-61a33ab2f3e8__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_938b9ffe-4340-46e1-bd6f-ad73d0b4f875__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_3107b0db-3428-4ac8-a8e1-95b4ecac0bf4__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_675d633f-498e-485c-886f-26c7d7e21ac4__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_d73d4c10-8387-48db-92cb-9ffa49395ae1__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_a6866f7e-75da-4067-a8b4-f0a52070acad__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_ebd5c282-6feb-4cfd-959a-ffc1739185aa__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_6f61bf30-bc94-4085-879c-4e3330dc9363__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_79ed7174-6d9b-44c0-a4b8-195fdd9013ec__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_768aaaf8-0f7b-4951-bd99-12475a115b11__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_466aee4b-c1d6-4216-834a-ff62409db2a7__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_d7ce374a-9285-447c-9583-bd890268e464__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_e6e1dd9a-fc0c-4694-8c4a-0df241c11e8c__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_4d3cc011-2176-4d78-b2fd-0a40c9aa4ed9__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(7) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(7) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_ecaa22b9-95c4-4b9e-bc7e-ce36904c8ab9__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(13) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(13) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_f6e033c9-c845-42a3-9f03-7329203bd73a__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(19) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(19) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_e1540fd7-b5f2-4511-a4db-da0a2d093d22__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(25) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(25) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_101cbc38-5b01-4edf-ba30-83062fc08709__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(31) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(31) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_f7d33e36-bac9-4bb7-9085-755c7dcd8b71__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(37) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(37) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_111d7c42-4b91-48e7-8762-1d6ecf37d31e__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(43) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(43) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_41786600-17ef-4981-8f23-105bd73cf0be__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(49) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(49) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_511a14c5-5da3-485a-a00d-a3a0d3a09563__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(56) > label.mf-lbl-radio",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_Fields_5d829124-7efa-467f-9fa5-c63b8b5878b3__Value",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(63) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(63) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(66) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(66) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(69) > label:nth-child(2)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(69) > label:nth-child(3)",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > div:nth-child(73) > label.mf-lbl-radio",
            "#fxb_918f1974-57b6-497f-83b7-bb2f90f4fc9a_b42fe63b-cb91-4439-8c4f-a77e1e5b9183 > div.input-wrapper.input-text > div > div > div > div > div > div.input-wrapper.input-text > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div.input-wrapper.input-text > div > div > div > input[type=submit]:nth-child(81)"
          ]
        }
      },
      {
        "name": "embed-video",
        "instances": [
          ".infoPanel div.iframeWrapper"
        ]
      },
      {
        "name": "video-date-select",
        "instances": [
          "#page-content > div:has(> select[id$='_dwnVideos'])"
        ]
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
          "notice",
          "form",
          "embed-video",
          "video-date-select"
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
    ],
    "pageCleanup": {
      "https://www.cnv.org/City-Hall/Contact/Have-Your-Say": [
        "html > body:nth-child(2) > div:nth-child(2)"
      ],
      "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings": [
        "html > body:nth-child(2) > div:nth-child(5)"
      ],
      "https://www.cnv.org/City-Hall/Council-Meetings/Public-Hearings-and-Public-Meetings/Public-Hearing-Sign-Up": [
        "html > body:nth-child(2) > div:nth-child(5)"
      ],
      "https://www.cnv.org/City-Hall/Council-Meetings/Public-Input-Period/Public-Input-Period-Registration": [
        "html > body:nth-child(2) > div:nth-child(5)"
      ],
      "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Invite-the-Mayor": [
        "html > body:nth-child(2) > div:nth-child(5)"
      ],
      "https://www.cnv.org/City-Hall/Mayor-Council/Mayor-Linda-Buchanan/Request-a-Certificate": [
        "html > body:nth-child(2) > div:nth-child(5)"
      ],
      "https://www.cnv.org/City-Hall/Online-Services/Service-Request": [
        "html > body:nth-child(2) > div:nth-child(5)"
      ],
      "https://www.cnv.org/Home-Property/Fire-Department/Community-Awareness-and-Public-Safety-Program": [
        "html > body:nth-child(2) > div:nth-child(2)"
      ],
      "https://www.cnv.org/Parks-Recreation/Public-Spaces/Musician": [
        "html > body:nth-child(2) > div:nth-child(2)"
      ],
      "https://www.cnv.org/Parks-Recreation/Public-Spaces/Venue-Booking-Application": [
        "html > body:nth-child(2) > div:nth-child(2)"
      ]
    }
  };
  var parsers = {
    "breadcrumb": parse,
    "notice": parse2,
    "form": parse3,
    "embed-video": parse4,
    "video-date-select": parse5
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
  var import_form_page_sidebar_default = {
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
  return __toCommonJS(import_form_page_sidebar_exports);
})();
