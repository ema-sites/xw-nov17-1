import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const DATE_PATTERN = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}$|^\d{4}-\d{2}-\d{2}$|^\d{1,2}\/\d{1,2}\/\d{2,4}$/i;

function isLinkOnly(p) {
  return p.children.length === 1 && p.firstElementChild.tagName === 'A'
    && p.textContent.trim() === p.firstElementChild.textContent.trim();
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-news-card-image';
      } else if (!div.textContent.trim() && !div.querySelector('picture')) {
        // Text-only news items author an empty image cell; drop it.
        div.remove();
      } else {
        div.className = 'cards-news-card-body';
      }
    });

    const body = li.querySelector('.cards-news-card-body');
    if (body) {
      const paras = [...body.querySelectorAll(':scope > p')];
      paras.forEach((p) => {
        if (!p.children.length && DATE_PATTERN.test(p.textContent.trim())) {
          p.classList.add('cards-news-card-date');
        }
      });
      const last = paras[paras.length - 1];
      if (last && isLinkOnly(last) && !last.classList.contains('cards-news-card-date')) {
        last.classList.add('cards-news-card-cta');
      }
    }
    if (!li.querySelector('.cards-news-card-image')) li.classList.add('cards-news-card-text-only');
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
