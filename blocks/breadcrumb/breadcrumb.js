/**
 * Breadcrumb block
 * Authored as one cell holding the trail: a list of links, or links in a paragraph.
 * Plain text (or a final item without a link) is the current page.
 * With no authored content the trail is built from the page path.
 */

function pathTrail() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  const items = [{ text: 'Home', href: '/' }];
  let href = '';
  segments.forEach((segment) => {
    href += `/${segment}`;
    items.push({
      text: decodeURIComponent(segment).replace(/[-_]+/g, ' '),
      href,
    });
  });
  return items;
}

function authoredTrail(block) {
  const items = [];
  const listItems = block.querySelectorAll('li');
  if (listItems.length) {
    listItems.forEach((li) => {
      const a = li.querySelector('a');
      const text = li.textContent.trim();
      if (text) items.push({ text, href: a ? a.href : null });
    });
    return items;
  }
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    cell.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('a')) {
        node.childNodes.forEach((child) => {
          if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'A') {
            items.push({ text: child.textContent.trim(), href: child.href });
          } else {
            const text = child.textContent.replace(/[>›»/|]/g, '').trim();
            if (text) items.push({ text, href: null });
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
        items.push({ text: node.textContent.trim(), href: node.href });
      } else {
        const text = node.textContent.replace(/[>›»/|]/g, '').trim();
        if (text) items.push({ text, href: null });
      }
    });
  });
  return items.filter((item) => item.text);
}

export default function decorate(block) {
  let items = authoredTrail(block);
  if (!items.length) items = pathTrail();

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    const isLast = i === items.length - 1;
    if (item.href && !isLast) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.text;
      li.append(a);
    } else {
      const span = document.createElement('span');
      span.textContent = item.text;
      if (isLast) span.setAttribute('aria-current', 'page');
      li.append(span);
    }
    ol.append(li);
  });

  nav.append(ol);
  block.replaceChildren(nav);
}
