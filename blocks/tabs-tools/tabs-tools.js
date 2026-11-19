import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Tabs Tools: a row of icon tabs switching between tool panels
 * (e.g. Calendar, What Goes Where, Game, Need help?).
 * One row per tab: first cell is the tab label (optionally with an icon or image),
 * the remaining cells are the panel content.
 * A panel whose only content is a link to a fragment (/fragments/...) loads that
 * fragment, so a panel can hold complex content such as other blocks.
 */

let tabsToolsCount = 0;

async function loadPanelFragment(tabpanel) {
  const links = tabpanel.querySelectorAll('a[href]');
  if (links.length !== 1) return;
  const link = links[0];
  const href = link.getAttribute('href');
  const path = new URL(href, window.location.href).pathname;
  if (!path.includes('/fragments/')) return;
  if (tabpanel.textContent.trim() !== link.textContent.trim()) return;
  const fragment = await loadFragment(path.replace(/(\.plain)?\.html$/, ''));
  if (!fragment) return;
  const content = document.createElement('div');
  content.className = 'tabs-tools-fragment';
  while (fragment.firstElementChild) content.append(fragment.firstElementChild);
  link.closest('div').replaceChildren(content);
}

export default async function decorate(block) {
  tabsToolsCount += 1;
  const tablist = document.createElement('div');
  tablist.className = 'tabs-tools-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tabs-tools-list-${tabsToolsCount}`;

  const rows = [...block.children].filter((row) => row.firstElementChild);
  const fragmentLoads = [];

  rows.forEach((tabpanel, i) => {
    const tab = tabpanel.firstElementChild;
    const id = `tabs-tools-panel-${tabsToolsCount}-${i + 1}`;

    tabpanel.className = 'tabs-tools-panel';
    tabpanel.id = id;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const button = document.createElement('button');
    button.className = 'tabs-tools-tab';
    button.id = `tab-${id}`;
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);

    const media = tab.querySelector('picture, span.icon');
    if (media) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'tabs-tools-tab-icon';
      iconWrap.append(media);
      button.append(iconWrap);
    }
    const label = document.createElement('span');
    label.className = 'tabs-tools-tab-label';
    label.textContent = tab.textContent.trim();
    button.append(label);

    button.addEventListener('click', () => {
      block.querySelectorAll('.tabs-tools-panel').forEach((panel) => panel.setAttribute('aria-hidden', true));
      tablist.querySelectorAll('button').forEach((btn) => btn.setAttribute('aria-selected', false));
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
    // removing the label cell also removes it from the UE tree
    moveInstrumentation(tab, null);
    tab.remove();
    fragmentLoads.push(loadPanelFragment(tabpanel));
  });

  block.prepend(tablist);
  await Promise.all(fragmentLoads);
}
