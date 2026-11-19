/**
 * Title Bar: panel header bar with a title on the left and actions on the right
 * (e.g. "Need help?" link), ending with a Share dropdown.
 * Authored content: row 1 the title; row 2 (optional) action links.
 * The Share dropdown (Facebook, X, LinkedIn, Email, Copy link for the current
 * page) is runtime UI drawn here, not authored.
 */

let titleBarCount = 0;

function buildShare() {
  titleBarCount += 1;
  const menuId = `title-bar-share-${titleBarCount}`;
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);
  const targets = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}` },
    { label: 'Email', href: `mailto:?subject=${pageTitle}&body=${pageUrl}` },
  ];

  const wrap = document.createElement('div');
  wrap.className = 'title-bar-share';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'title-bar-share-toggle';
  toggle.textContent = 'Share';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', menuId);

  const menu = document.createElement('ul');
  menu.className = 'title-bar-share-menu';
  menu.id = menuId;
  menu.hidden = true;
  targets.forEach(({ label, href }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (!href.startsWith('mailto:')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    li.append(a);
    menu.append(li);
  });
  const copyItem = document.createElement('li');
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.textContent = 'Copy link';
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      copy.textContent = 'Link copied';
    } catch (e) {
      copy.textContent = 'Copy failed';
    }
  });
  copyItem.append(copy);
  menu.append(copyItem);

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };
  toggle.addEventListener('click', () => setOpen(menu.hidden));
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) setOpen(false);
  });
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });

  wrap.append(toggle, menu);
  return wrap;
}

export default function decorate(block) {
  const rows = [...block.children];
  const titleRow = rows.shift();
  const title = document.createElement('div');
  title.className = 'title-bar-title';
  if (titleRow) {
    const cells = [...titleRow.children];
    // a single row with two cells: title | actions
    if (cells.length > 1 && !rows.length) rows.push(cells.pop());
    cells.forEach((cell) => {
      while (cell.firstChild) title.append(cell.firstChild);
    });
  }

  const actions = document.createElement('div');
  actions.className = 'title-bar-actions';
  rows.forEach((row) => {
    row.querySelectorAll('a[href]').forEach((a) => {
      const item = document.createElement('div');
      item.className = 'title-bar-action';
      a.classList.remove('button');
      a.closest('.button-container')?.classList.remove('button-container');
      item.append(a);
      actions.append(item);
    });
  });
  actions.append(buildShare());

  block.replaceChildren(title, actions);
}
