import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Cards Feature: grid of feature cards.
 * One row per card: image cell (picture, optional) + text cell.
 * - Feature cards (text cell has a heading): photo or icon, title, blurb, "Learn More" link.
 * - Link tiles (no heading): icon above a short label; the whole tile is clickable.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (!div.children.length && !div.textContent.trim()) {
        div.remove();
        return;
      }
      const onlyPicture = div.children.length === 1 && div.querySelector('picture');
      div.className = onlyPicture ? 'cards-feature-card-image' : 'cards-feature-card-body';
    });

    const body = li.querySelector('.cards-feature-card-body');
    const isTile = !li.querySelector('h1, h2, h3, h4, h5, h6');
    li.classList.add(isTile ? 'cards-feature-card-tile' : 'cards-feature-card-feature');

    if (body) {
      [...body.querySelectorAll(':scope > p')].forEach((p) => {
        if (p.children.length === 1 && p.querySelector(':scope > .icon') && !p.textContent.trim()) {
          p.classList.add('cards-feature-card-icon');
        } else if (!isTile && p.children.length === 1 && p.querySelector(':scope > a')
          && p.textContent.trim() === p.firstElementChild.textContent.trim()) {
          p.classList.add('cards-feature-card-more');
        }
      });
      if (isTile && body.querySelector('a')) li.classList.add('cards-feature-card-linked');
    }
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
