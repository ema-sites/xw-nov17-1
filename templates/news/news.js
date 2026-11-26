/**
 * News template (page metadata `template: news`): the News Room section menu in a left sidebar
 * beside a 772px content column, as on the source site.
 *
 * The menu is one shared fragment, /fragments/news-room-nav: a heading (linking to the News Room)
 * and a list of links. Authors edit it once; every news page shows it.
 */
const FRAGMENT = '/fragments/news-room-nav';

async function fetchFragment(path) {
  // local preview serves content under /content; Edge Delivery serves it at the site root
  let resp = await fetch(`/content${path}.plain.html`);
  if (!resp.ok) resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) return null;
  return new DOMParser().parseFromString(await resp.text(), 'text/html');
}

function markCurrent(aside) {
  const here = window.location.pathname.replace(/\/$/, '').replace(/^\/content/, '').toLowerCase();
  aside.querySelectorAll('li > a[href]').forEach((a) => {
    const target = new URL(a.href, window.location.href).pathname.replace(/\/$/, '').toLowerCase();
    if (target && (here === target || here.startsWith(`${target}/`))) {
      a.setAttribute('aria-current', 'page');
    }
  });
}

async function buildAside(section) {
  const doc = await fetchFragment(FRAGMENT);
  if (!doc) return;
  const heading = doc.querySelector('h1, h2, h3, h4');
  const list = doc.querySelector('ul');
  if (!heading && !list) return;

  const aside = document.createElement('aside');
  aside.className = 'news-aside';
  aside.setAttribute('aria-label', heading ? heading.textContent.trim() : 'Section');
  if (heading) {
    const title = document.createElement('p');
    title.className = 'news-aside-title';
    title.append(...heading.childNodes);
    aside.append(title);
  }
  if (list) {
    list.className = 'news-aside-links';
    aside.append(list);
  }
  markCurrent(aside);
  section.prepend(aside);
}

/**
 * @param {Element} main the decorated main element
 */
export default function decorate(main) {
  // the first section that isn't the breadcrumb holds the page content
  const section = [...main.querySelectorAll(':scope > .section')]
    .find((s) => !s.querySelector('.breadcrumb'));
  if (!section) return;
  section.classList.add('news-layout');
  buildAside(section);
}
