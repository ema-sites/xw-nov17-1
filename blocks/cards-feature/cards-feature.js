import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-feature-card-image';
      } else if (!div.textContent.trim() && !div.querySelector('picture')) {
        div.remove();
      } else {
        div.className = 'cards-feature-card-body';
      }
    });

    // The last paragraph holding only a link is the card CTA.
    const body = li.querySelector('.cards-feature-card-body');
    if (body) {
      const paras = [...body.querySelectorAll(':scope > p')];
      const last = paras[paras.length - 1];
      if (last && last.children.length === 1 && last.firstElementChild.tagName === 'A'
        && last.textContent.trim() === last.firstElementChild.textContent.trim()) {
        last.classList.add('cards-feature-card-cta');
      }
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
