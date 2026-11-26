// Desktop layout starts at 1200px (source switches to the hamburger menu below that width).
const DESKTOP = window.matchMedia('(width >= 1200px)');
const OPEN_DELAY = 100; // hover-intent delay before a megamenu opens
const CLOSE_DELAY = 700; // delay before a megamenu closes once the pointer leaves it
const DRAWER_DURATION = 350; // mobile drawer open/close
const ACCORDION_DURATION = 400; // mobile accordion expand/collapse

/**
 * Fetches the nav fragment. Metadata-independent dual fetch:
 * /content/nav.plain.html (local preview) first, then /nav.plain.html (production).
 * @returns {Promise<Document|null>} parsed fragment document
 */
async function fetchNavFragment() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // AEM (Universal Editor) wraps a list item's label in a paragraph when the item has a sub-list
  // (<li><p><a>..</a></p><ul>..): unwrap it so every item reads as <li><a>..</a><ul>..
  doc.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
  // resolve relative media against the fragment URL, not the current page
  doc.querySelectorAll('img[src], source[srcset]').forEach((media) => {
    if (media.hasAttribute('src')) media.setAttribute('src', new URL(media.getAttribute('src'), resp.url).href);
    if (media.hasAttribute('srcset')) {
      const set = media.getAttribute('srcset').split(',').map((part) => {
        const [url, size] = part.trim().split(/\s+/);
        return [new URL(url, resp.url).href, size].filter(Boolean).join(' ');
      });
      media.setAttribute('srcset', set.join(', '));
    }
  });
  return doc;
}

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

/** Returns the direct child element of `parent` matching `tag`. */
function child(parent, tag) {
  return [...parent.children].find((c) => c.tagName === tag.toUpperCase());
}

/** Returns the label element of a list item, wrapping a text-only label in a span. */
function labelOf(li, className) {
  const link = child(li, 'a');
  if (link) {
    link.classList.add(className);
    return link;
  }
  const textNodes = [...li.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE);
  const span = el('span', className);
  span.textContent = textNodes.map((n) => n.textContent).join(' ').trim();
  textNodes.forEach((n) => n.remove());
  li.prepend(span);
  return span;
}

/** Mobile-only "overview" entry: a copy of the parent's own link, shown first in its sub-list. */
function overviewItem(link, className) {
  if (!link || link.tagName !== 'A') return null;
  const li = el('li', `nav-overview ${className}-item`);
  const a = link.cloneNode(true);
  a.className = `nav-overview-link ${className}`;
  a.removeAttribute('aria-expanded');
  a.removeAttribute('aria-haspopup');
  li.append(a);
  return li;
}

/** Height slide (mobile drawer + accordions) using the Web Animations API. */
function slide(target, open, duration) {
  const node = target;
  node.getAnimations().forEach((a) => a.cancel());
  if (open) node.hidden = false;
  const full = `${node.scrollHeight}px`;
  node.style.overflow = 'hidden';
  const anim = node.animate(
    [{ height: open ? '0px' : full }, { height: open ? full : '0px' }],
    { duration, easing: 'ease' },
  );
  anim.onfinish = () => {
    node.style.overflow = '';
    if (!open) node.hidden = true;
  };
  anim.oncancel = () => { node.style.overflow = ''; };
}

/* ---------------- brand + tools ---------------- */

function buildBrand(section) {
  const brand = el('div', 'nav-brand');
  const images = [...section.querySelectorAll('img')];
  const link = section.querySelector('a');
  // AEM (md2jcr) drops an image that sits inside a link, so the brand can arrive as empty
  // home links: fall back to the logos kept in the code repo.
  if (!images.length) {
    [['cnv-logo.png', 'City of North Vancouver logo'], ['cnv-logo-mobile.svg', 'City of North Vancouver']]
      .forEach(([file, alt]) => images.push(el('img', '', { src: `${window.hlx?.codeBasePath || ''}/icons/${file}`, alt })));
  }
  const home = el('a', 'nav-brand-link', { href: link ? link.getAttribute('href') : '/' });
  home.setAttribute('aria-label', images[0]?.getAttribute('alt') || 'Home');
  images.forEach((img, i) => {
    const pic = img.closest('picture') || img;
    const cls = i === 0 ? 'nav-logo-desktop' : 'nav-logo-mobile';
    img.classList.add(cls);
    if (pic !== img) pic.classList.add(cls);
    img.removeAttribute('width');
    img.removeAttribute('height');
    home.append(pic);
  });
  brand.append(home);
  return brand;
}

function buildSearch(p) {
  const link = p.querySelector('a');
  const action = link ? link.getAttribute('href') : '/search';
  const label = (link ? link.textContent : '').trim() || 'Search';
  const icon = p.querySelector('picture') || p.querySelector('img')
    || el('img', '', { src: `${window.hlx?.codeBasePath || ''}/icons/search.jpg`, alt: '' });
  const form = el('form', 'nav-search', { role: 'search', action });
  const input = el('input', 'nav-search-input', {
    type: 'text', name: 'searchTerm', placeholder: label, 'aria-label': label, autocomplete: 'off',
  });
  const button = el('button', 'nav-search-button', { type: 'submit', 'aria-label': label });
  if (icon) {
    const img = icon.tagName === 'IMG' ? icon : icon.querySelector('img');
    if (img) img.setAttribute('alt', '');
    button.append(icon);
  }
  form.append(input, button);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new URL(action, window.location.href);
    url.searchParams.set('searchTerm', input.value.trim());
    window.location.href = url.href;
  });
  return form;
}

function buildTools(section) {
  const tools = el('div', 'nav-tools');
  const list = child(section, 'ul');
  if (list) {
    list.classList.add('nav-utility');
    tools.append(list);
  }
  const paragraphs = [...section.querySelectorAll('p')];
  const searchP = paragraphs.find((p) => p.querySelector('a'));
  if (searchP) tools.append(buildSearch(searchP));
  const iconP = paragraphs.find((p) => !p.querySelector('a') && p.querySelector('img'));
  const menuIcon = iconP ? (iconP.querySelector('picture') || iconP.querySelector('img')) : null;
  return { tools, menuIcon };
}

/* ---------------- megamenu ---------------- */

function buildColumns(columnLists, parentLink) {
  const inner = el('div', 'nav-megamenu-panel-inner');
  const overview = overviewItem(parentLink, 'nav-section-title');
  if (overview) {
    const list = el('ul', 'nav-overview-list');
    list.append(overview);
    inner.append(list);
  }
  columnLists.forEach((ul) => {
    ul.classList.add('nav-megamenu-col');
    [...ul.children].forEach((section) => {
      section.classList.add('nav-section');
      const title = labelOf(section, 'nav-section-title');
      const links = child(section, 'ul');
      if (!links) return;
      section.classList.add('has-links');
      links.classList.add('nav-section-links');
      [...links.children].forEach((li) => {
        const a = child(li, 'a');
        if (a) a.classList.add('nav-section-link');
      });
      const sectionOverview = overviewItem(title, 'nav-section-link');
      if (sectionOverview) links.prepend(sectionOverview);
    });
    inner.append(ul);
  });
  return inner;
}

function buildMegamenu(topLi, subList) {
  const mega = el('div', 'nav-megamenu');
  subList.classList.add('nav-megamenu-sidebar');
  const topOverview = overviewItem(topLi.querySelector(':scope > .nav-trigger'), 'nav-sidebar-link');
  [...subList.children].forEach((li, i) => {
    li.classList.add('nav-sidebar-item');
    const link = labelOf(li, 'nav-sidebar-link');
    const columns = [...li.children].filter((c) => c.tagName === 'UL');
    if (!columns.length) return;
    li.classList.add('has-panel');
    const panel = el('div', 'nav-megamenu-panel', { 'data-index': i });
    panel.append(buildColumns(columns, link));
    li.panel = panel;
    li.append(panel);
  });
  if (topOverview) subList.prepend(topOverview);
  mega.append(subList);
  return mega;
}

/* ---------------- desktop behaviour ---------------- */

function activateSidebarItem(mega, li) {
  mega.querySelectorAll('.nav-sidebar-item.active').forEach((item) => {
    if (item !== li) item.classList.remove('active');
  });
  mega.querySelectorAll('.nav-megamenu-panel.active').forEach((p) => {
    if (!li || p !== li.panel) p.classList.remove('active');
  });
  if (!li) return;
  li.classList.add('active');
  if (li.panel) li.panel.classList.add('active');
}

function setExpanded(li, expanded) {
  li.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  li.querySelector(':scope > .nav-trigger')?.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function closeAllMenus(nav, except) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    if (li !== except) setExpanded(li, false);
  });
}

function openMenu(nav, li) {
  closeAllMenus(nav, li);
  if (li.getAttribute('aria-expanded') === 'true') return;
  setExpanded(li, true);
  const mega = li.querySelector('.nav-megamenu');
  // the first sidebar item is shown expanded whenever a megamenu opens
  if (mega) activateSidebarItem(mega, mega.querySelector('.nav-sidebar-item'));
}

function bindDesktopMenus(nav) {
  nav.querySelectorAll('.nav-drop').forEach((li) => {
    let openTimer;
    let closeTimer;
    li.addEventListener('mouseenter', () => {
      if (!DESKTOP.matches) return;
      clearTimeout(closeTimer);
      openTimer = setTimeout(() => openMenu(nav, li), OPEN_DELAY);
    });
    li.addEventListener('mouseleave', () => {
      if (!DESKTOP.matches) return;
      clearTimeout(openTimer);
      closeTimer = setTimeout(() => setExpanded(li, false), CLOSE_DELAY);
    });
    // keyboard: focusing a trigger opens its panel
    li.addEventListener('focusin', () => { if (DESKTOP.matches) openMenu(nav, li); });
    const mega = li.querySelector('.nav-megamenu');
    if (!mega) return;
    mega.querySelectorAll('.nav-sidebar-item').forEach((item) => {
      const activate = () => { if (DESKTOP.matches) activateSidebarItem(mega, item); };
      item.querySelector(':scope > .nav-sidebar-link')?.addEventListener('mouseenter', activate);
      item.addEventListener('focusin', activate);
    });
  });
}

/* ---------------- mobile behaviour ---------------- */

/** Collapsible pairs for the mobile accordion: [item li, its toggle label, its sub-list]. */
function accordionParts(item) {
  if (item.classList.contains('nav-drop')) {
    return [item.querySelector(':scope > .nav-trigger'), item.querySelector(':scope > .nav-megamenu')];
  }
  if (item.classList.contains('has-panel')) {
    return [item.querySelector(':scope > .nav-sidebar-link'), item.panel];
  }
  return [item.querySelector(':scope > .nav-section-title'), item.querySelector(':scope > .nav-section-links')];
}

function setAccordion(item, open, animate = true) {
  const [, body] = accordionParts(item);
  if (!body) return;
  const isOpen = item.classList.contains('mobile-open');
  if (open === isOpen) return;
  item.classList.toggle('mobile-open', open);
  if (item.classList.contains('nav-drop')) setExpanded(item, open);
  if (animate) slide(body, open, ACCORDION_DURATION);
  else body.hidden = !open;
  if (!open) {
    item.querySelectorAll('.mobile-open').forEach((inner) => setAccordion(inner, false, false));
  }
}

function bindMobileAccordion(nav) {
  const items = nav.querySelectorAll('.nav-drop, .nav-sidebar-item.has-panel, .nav-section.has-links');
  items.forEach((item) => {
    const [toggle] = accordionParts(item);
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      if (DESKTOP.matches) return;
      e.preventDefault();
      const open = !item.classList.contains('mobile-open');
      // single expand: close open siblings at the same level
      if (open) {
        [...item.parentElement.children].forEach((sib) => {
          if (sib !== item && sib.classList.contains('mobile-open')) setAccordion(sib, false);
        });
      }
      setAccordion(item, open);
    });
  });
}

function resetMobileAccordion(nav) {
  nav.querySelectorAll('.mobile-open').forEach((item) => item.classList.remove('mobile-open'));
  nav.querySelectorAll('.nav-megamenu, .nav-megamenu-panel, .nav-section-links').forEach((body) => {
    body.getAnimations().forEach((a) => a.cancel());
    body.hidden = !DESKTOP.matches;
  });
  nav.querySelectorAll('.nav-drop').forEach((li) => setExpanded(li, false));
}

function toggleMobileMenu(nav, force) {
  const sections = nav.querySelector('.nav-sections');
  const expanded = force !== undefined ? force : nav.getAttribute('aria-expanded') !== 'true';
  const wasExpanded = nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  const button = nav.querySelector('.nav-hamburger button');
  button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  if (!sections || DESKTOP.matches) return;
  if (expanded !== wasExpanded) slide(sections, expanded, DRAWER_DURATION);
}

/* ---------------- responsive placement ---------------- */

/** Desktop: link panels sit beside the sidebar and search sits in the tools row.
 *  Mobile: panels nest inside their sidebar item and search is the first drawer row. */
function placeResponsive(nav) {
  nav.querySelectorAll('.nav-sidebar-item.has-panel').forEach((li) => {
    const mega = li.closest('.nav-megamenu');
    if (DESKTOP.matches) {
      if (li.panel.parentElement !== mega) mega.append(li.panel);
    } else if (li.panel.parentElement !== li) {
      li.append(li.panel);
    }
  });
  const form = nav.querySelector('.nav-search');
  const tools = nav.querySelector('.nav-tools');
  const searchItem = nav.querySelector('.nav-search-item');
  if (!form || !tools || !searchItem) return;
  if (DESKTOP.matches) tools.append(form);
  else searchItem.append(form);
}

function buildSections(section) {
  const wrapper = el('div', 'nav-sections');
  const inner = el('div', 'nav-menu-wrapper');
  const list = child(section, 'ul') || el('ul');
  list.classList.add('nav-list');
  [...list.children].forEach((li) => {
    li.classList.add('nav-item');
    const trigger = labelOf(li, 'nav-trigger');
    const sub = child(li, 'ul');
    if (!sub) return;
    li.classList.add('nav-drop');
    li.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    li.append(buildMegamenu(li, sub));
  });
  list.prepend(el('li', 'nav-search-item'));
  inner.append(list);
  wrapper.append(inner);
  return wrapper;
}

/* ---------------- block ---------------- */

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNavFragment();
  if (!fragment) return;
  const sections = [...fragment.body.children].filter((c) => c.tagName === 'DIV');
  const [brandSection, toolsSection, navSection] = sections;

  const nav = el('nav', '', { id: 'nav', 'aria-label': 'Main navigation', 'aria-expanded': 'false' });
  const bar = el('div', 'nav-brand-bar');
  if (brandSection) bar.append(buildBrand(brandSection));
  const { tools, menuIcon } = toolsSection ? buildTools(toolsSection) : {};
  if (tools) bar.append(tools);

  const hamburger = el('div', 'nav-hamburger');
  const button = el('button', '', {
    type: 'button', 'aria-controls': 'nav', 'aria-expanded': 'false', 'aria-label': 'Open navigation',
  });
  if (menuIcon) {
    const img = menuIcon.tagName === 'IMG' ? menuIcon : menuIcon.querySelector('img');
    if (img) img.setAttribute('alt', '');
    button.append(menuIcon);
  } else {
    button.innerHTML = '<span class="nav-hamburger-icon"></span>';
  }
  button.addEventListener('click', () => toggleMobileMenu(nav));
  hamburger.append(button);
  bar.append(hamburger);
  nav.append(bar);

  if (navSection) nav.append(buildSections(navSection));

  placeResponsive(nav);
  resetMobileAccordion(nav);
  const drawer = nav.querySelector('.nav-sections');
  if (drawer) drawer.hidden = !DESKTOP.matches;
  bindDesktopMenus(nav);
  bindMobileAccordion(nav);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (DESKTOP.matches) closeAllMenus(nav);
    else if (nav.getAttribute('aria-expanded') === 'true') {
      toggleMobileMenu(nav, false);
      button.focus();
    }
  });

  // viewport resize: reset menus, hamburger and placement when crossing the breakpoint
  DESKTOP.addEventListener('change', () => {
    closeAllMenus(nav);
    nav.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation');
    const sectionsEl = nav.querySelector('.nav-sections');
    if (sectionsEl) {
      sectionsEl.getAnimations().forEach((a) => a.cancel());
      sectionsEl.removeAttribute('style');
      sectionsEl.hidden = !DESKTOP.matches;
    }
    nav.querySelectorAll('.nav-sidebar-item.active, .nav-megamenu-panel.active').forEach((n) => n.classList.remove('active'));
    placeResponsive(nav);
    resetMobileAccordion(nav);
  });

  const navWrapper = el('div', 'nav-wrapper');
  navWrapper.append(nav);
  block.textContent = '';
  block.append(navWrapper);
}
