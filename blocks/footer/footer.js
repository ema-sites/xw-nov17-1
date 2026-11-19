/**
 * Fetches the footer fragment. Metadata-independent dual fetch:
 * /content/footer.plain.html (local preview) first, then /footer.plain.html (production).
 * @returns {Promise<Document|null>} parsed fragment document
 */
async function fetchFooterFragment() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // resolve relative media against the fragment URL, not the current page
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.setAttribute('src', new URL(img.getAttribute('src'), resp.url).href);
  });
  return doc;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/** True when the element's only meaningful content is a single linked image. */
function isImageLink(node) {
  const link = node.querySelector(':scope > a');
  return !!link && !!link.querySelector('img, picture') && !node.textContent.trim();
}

/** Off-site links open in a new tab, like the source. */
function decorateLinks(root) {
  root.querySelectorAll('a[href]').forEach((a) => {
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin && /^https?:$/.test(url.protocol)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
  });
}

/** Tags fragment elements by their content shape so CSS can lay them out. */
function decorateColumn(column) {
  column.querySelectorAll(':scope > p').forEach((p) => {
    p.classList.add(isImageLink(p) ? 'footer-logo' : 'footer-text');
  });
  column.querySelectorAll(':scope > ul').forEach((ul) => {
    const items = [...ul.children];
    const iconList = items.length && items.every(isImageLink);
    ul.classList.add(iconList ? 'footer-icons' : 'footer-links');
  });
  column.querySelectorAll('img').forEach((img) => {
    img.loading = 'lazy';
    img.decoding = 'async';
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const doc = await fetchFooterFragment();
  block.textContent = '';
  if (!doc) return;

  const sections = [...doc.body.children].filter((node) => node.tagName === 'DIV');
  if (!sections.length) return;

  // all sections but the last form the main band; the last one is the bottom (legal) bar
  const bottomSection = sections.length > 1 ? sections.pop() : null;

  const main = el('div', 'footer-band footer-main');
  const mainInner = el('div', 'footer-inner');
  sections.forEach((section, i) => {
    const column = el('div', `footer-column footer-column-${i + 1}`);
    column.append(...section.childNodes);
    decorateColumn(column);
    mainInner.append(column);
  });
  main.append(mainInner);
  block.append(main);

  if (bottomSection) {
    const bottom = el('div', 'footer-band footer-bottom');
    const bottomInner = el('div', 'footer-inner');
    bottomInner.append(...bottomSection.childNodes);
    decorateColumn(bottomInner);
    bottom.append(bottomInner);
    block.append(bottom);
  }

  decorateLinks(block);
}
