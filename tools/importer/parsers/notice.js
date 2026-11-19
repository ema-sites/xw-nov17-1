/* eslint-disable */
/* global WebImporter */

/**
 * Parser for notice.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selector: .content-section > div.call-out-info.call-out-icon
 * Model: notice { image (reference icon), imageAlt (collapsed), text (richtext message) }.
 * Rows: [icon image] (only when the source icon is an <img>), [message].
 *
 * FontAwesome icons (<i class="far fa-...">) have no image asset; the icon name is kept
 * as an :fa-name: token at the start of the message, which the notice block moves into
 * its icon slot (it looks for span.icon anywhere in the block).
 */

const FA_NON_ICON = /^fa-(regular|solid|light|thin|duotone|sharp|brands|fw|lg|xs|sm|\d+x)$/;

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
    if (node.nodeType === 1 && node.tagName === 'BR') { flush(); return; }
    const inline = node.nodeType === 3 || (node.nodeType === 1 && /^(A|STRONG|B|EM|I|SPAN|SUP|SUB|U|SMALL)$/.test(node.tagName));
    if (inline) {
      if (node.nodeType === 3 && !node.textContent.trim() && !pending) return;
      if (!pending) pending = document.createElement('p');
      pending.appendChild(node.nodeType === 3 ? document.createTextNode(node.textContent.replace(/\s+/g, ' ')) : node);
      return;
    }
    flush();
    if (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('img'))) nodes.push(node);
  });
  flush();
  return nodes;
}

export default function parse(element, { document }) {
  const columns = element.querySelector('.call-out-info-columns') || element;
  const cells = [];

  const iconImg = columns.querySelector(':scope > img, :scope > picture img');
  const faIcon = columns.querySelector(':scope > i[class*="fa-"], :scope > em[class*="fa-"], :scope > span[class*="fa-"]');
  let token = null;
  if (faIcon) {
    const name = Array.from(faIcon.classList).find((c) => c.startsWith('fa-') && !FA_NON_ICON.test(c));
    if (name) token = `:${name}:`;
    faIcon.remove();
  }

  if (iconImg) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:image '));
    const img = document.createElement('img');
    img.setAttribute('src', iconImg.getAttribute('src'));
    img.setAttribute('alt', iconImg.getAttribute('alt') || '');
    frag.appendChild(img);
    iconImg.remove();
    cells.push([frag]);
  } else {
    // The model's first row is the icon (image): it must exist even when empty, or the
    // message would be read into the image field (md2jcr / Universal Editor).
    cells.push(['']);
  }

  const body = columns.querySelector(':scope > div') || columns;
  const nodes = [];
  if (token) {
    const p = document.createElement('p');
    p.textContent = token;
    nodes.push(p);
  }
  const title = body.querySelector(':scope > .featureTitle');
  if (title && title.textContent.trim()) {
    const h = document.createElement('h3');
    h.textContent = title.textContent.replace(/\s+/g, ' ').trim();
    nodes.push(h);
  }
  nodes.push(...richContent(document, body, '.featureTitle'));

  // Photos inside the message can't live in the rich-text "text" field (md2jcr stops a rich text at
  // an image): move them out of the block, right after it, as page content.
  const photos = [];
  nodes.forEach((n) => {
    if (n.nodeType !== 1) return;
    const pics = n.matches('picture, img') ? [n] : Array.from(n.querySelectorAll('picture, img'))
      .filter((p) => !(p.tagName === 'IMG' && p.parentElement && p.parentElement.tagName === 'PICTURE'));
    pics.forEach((pic) => {
      const holder = pic.closest('p');
      const p = document.createElement('p');
      p.appendChild(pic);
      photos.push(p);
      if (holder && !holder.textContent.trim() && !holder.querySelector('img, picture')) holder.remove();
    });
  });
  const kept = nodes.filter((n) => !(n.nodeType === 1 && !n.isConnected && !n.textContent.trim()
    && !n.querySelector?.('img, picture')) && !(n.nodeType === 1 && n.matches('picture, img')));
  nodes.length = 0;
  nodes.push(...kept);

  if (nodes.length) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:text '));
    nodes.forEach((n) => frag.appendChild(n));
    cells.push([frag]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'notice', cells });
  element.replaceWith(block);
  photos.reverse().forEach((p) => block.after(p));
}
