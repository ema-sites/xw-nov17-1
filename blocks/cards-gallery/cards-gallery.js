import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Cards Gallery: photo gallery (Galleria "twelve" look on the source).
 * Authored content: one row per photo — an image cell and an optional caption cell.
 * Runtime UI drawn here (not authored): the stage showing the current photo with prev / next
 * arrows, the bar (thumbnails toggle, play / pause, "n / total" counter and caption, popout,
 * fullscreen), the thumbnail grid overlay and the popout lightbox.
 */

const AUTOPLAY_MS = 5000;

function button(className, label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.setAttribute('aria-label', label);
  return btn;
}

/** Flickr serves sized variants: use the small square one for thumbnails. */
function thumbSrc(src) {
  return /staticflickr\.com\/.+_[a-z]\.jpg$/i.test(src) ? src.replace(/_[a-z]\.jpg$/i, '_q.jpg') : src;
}

function buildLightbox(items, onChange) {
  const dialog = document.createElement('dialog');
  dialog.className = 'cards-gallery-lightbox';
  dialog.setAttribute('aria-label', 'Photo viewer');
  const close = button('cards-gallery-lightbox-close', 'Close');
  const prev = button('cards-gallery-lightbox-prev', 'Previous photo');
  const next = button('cards-gallery-lightbox-next', 'Next photo');
  const figure = document.createElement('figure');
  figure.className = 'cards-gallery-lightbox-figure';
  const info = document.createElement('div');
  info.className = 'cards-gallery-lightbox-info';
  info.innerHTML = '<span class="cards-gallery-lightbox-title"></span><span class="cards-gallery-lightbox-counter" aria-live="polite"></span>';
  figure.append(prev, next);
  dialog.append(close, figure, info);
  if (items.length < 2) dialog.classList.add('cards-gallery-lightbox-single');

  const title = info.querySelector('.cards-gallery-lightbox-title');
  const counter = info.querySelector('.cards-gallery-lightbox-counter');
  let img = null; // created on first show, so no src-less (broken) image is ever in the DOM
  let current = 0;

  const show = (index) => {
    current = (index + items.length) % items.length;
    const item = items[current];
    if (!img) {
      img = document.createElement('img');
      figure.prepend(img);
    }
    img.src = item.src;
    img.alt = item.alt;
    title.textContent = item.caption;
    counter.textContent = `${current + 1} / ${items.length}`;
    onChange(current);
  };

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  return {
    dialog,
    open: (index) => {
      show(index);
      dialog.showModal();
    },
  };
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  const items = [];

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-gallery-card-image';
      else div.className = 'cards-gallery-card-body';
    });
    const img = li.querySelector('img');
    if (!img) return;
    const linked = li.querySelector('a[href]');
    const isImageLink = linked && /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(linked.href);
    items.push({
      src: isImageLink ? linked.href : img.src,
      alt: img.alt || '',
      caption: li.querySelector('.cards-gallery-card-body')?.textContent.trim() || img.alt || '',
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) {
      img.src = thumbSrc(img.src);
      img.loading = 'lazy';
      return;
    }
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  if (!items.length) {
    block.append(ul);
    return;
  }

  // stage: current photo, arrows, autoplay progress
  const stage = document.createElement('div');
  stage.className = 'cards-gallery-stage';
  const frame = document.createElement('div');
  frame.className = 'cards-gallery-stage-image';
  const stageImg = document.createElement('img');
  stageImg.src = items[0].src;
  stageImg.alt = items[0].alt;
  frame.append(stageImg);
  const progress = document.createElement('div');
  progress.className = 'cards-gallery-progress';
  const prev = button('cards-gallery-nav-prev', 'Previous photo');
  const next = button('cards-gallery-nav-next', 'Next photo');
  stage.append(frame, prev, next, progress);

  // thumbnail grid overlay
  const thumbs = document.createElement('div');
  thumbs.className = 'cards-gallery-thumbnails';
  thumbs.id = `cards-gallery-thumbs-${Math.random().toString(36).slice(2, 8)}`;
  thumbs.inert = true;
  thumbs.append(ul);

  // bar
  const bar = document.createElement('div');
  bar.className = 'cards-gallery-bar';
  const thumbLink = button('cards-gallery-thumblink', 'Show thumbnails');
  thumbLink.setAttribute('aria-expanded', 'false');
  thumbLink.setAttribute('aria-controls', thumbs.id);
  const play = button('cards-gallery-play', 'Pause slideshow');
  const popout = button('cards-gallery-popout', 'Open photo viewer');
  const fullscreen = button('cards-gallery-fullscreen', 'Toggle fullscreen');
  const info = document.createElement('div');
  info.className = 'cards-gallery-info';
  info.innerHTML = '<span class="cards-gallery-counter" aria-live="polite"></span><span class="cards-gallery-title"></span>';
  const separators = ['s1', 's2', 's3', 's4'].map((s) => {
    const sep = document.createElement('span');
    sep.className = `cards-gallery-separator cards-gallery-${s}`;
    return sep;
  });
  bar.append(thumbLink, play, info, popout, fullscreen, ...separators);

  const counter = info.querySelector('.cards-gallery-counter');
  const title = info.querySelector('.cards-gallery-title');
  let current = 0;
  let timer = null;
  let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && items.length > 1;
  let inView = false;

  const restartProgress = () => {
    progress.classList.remove('running');
    if (!timer) return;
    // eslint-disable-next-line no-unused-expressions
    progress.offsetWidth; // reflow so the animation restarts
    progress.classList.add('running');
  };

  const show = (index) => {
    current = (index + items.length) % items.length;
    const item = items[current];
    if (stageImg.getAttribute('src') !== item.src) stageImg.src = item.src;
    stageImg.alt = item.alt;
    counter.textContent = `${current + 1} / ${items.length}`;
    title.textContent = item.caption;
    [...ul.children].forEach((li, i) => li.classList.toggle('active', i === current));
    restartProgress();
  };

  const stopTimer = () => {
    clearInterval(timer);
    timer = null;
    progress.classList.remove('running');
  };
  const startTimer = () => {
    stopTimer();
    if (!playing || !inView) return;
    timer = setInterval(() => show(current + 1), AUTOPLAY_MS);
    restartProgress();
  };
  const setPlaying = (value) => {
    playing = value && items.length > 1;
    play.classList.toggle('playing', playing);
    play.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    startTimer();
  };
  // manual navigation pauses the slideshow, as on the source
  const go = (index) => {
    setPlaying(false);
    show(index);
  };

  const toggleThumbs = (open) => {
    block.classList.toggle('thumbnails-open', open);
    thumbs.inert = !open;
    thumbLink.classList.toggle('open', open);
    thumbLink.setAttribute('aria-expanded', String(open));
    thumbLink.setAttribute('aria-label', open ? 'Hide thumbnails' : 'Show thumbnails');
  };

  const lightbox = buildLightbox(items, (i) => show(i));

  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  frame.addEventListener('click', () => {
    setPlaying(false);
    lightbox.open(current);
  });
  thumbLink.addEventListener('click', () => toggleThumbs(!block.classList.contains('thumbnails-open')));
  play.addEventListener('click', () => setPlaying(!playing));
  popout.addEventListener('click', () => {
    setPlaying(false);
    lightbox.open(current);
  });
  fullscreen.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (block.requestFullscreen) block.requestFullscreen();
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreen.classList.toggle('open', document.fullscreenElement === block);
  });
  block.addEventListener('keydown', (e) => {
    if (e.target.closest('dialog')) return;
    if (e.key === 'ArrowLeft') go(current - 1);
    if (e.key === 'ArrowRight') go(current + 1);
    if (e.key === 'Escape' && block.classList.contains('thumbnails-open')) toggleThumbs(false);
  });

  [...ul.children].forEach((li, i) => {
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-label', `Show photo ${i + 1} of ${items.length}`);
    const pick = (e) => {
      e.preventDefault();
      go(i);
      toggleThumbs(false);
      thumbLink.focus();
    };
    li.addEventListener('click', pick);
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') pick(e);
    });
  });

  if (items.length < 2) block.classList.add('single');
  block.append(stage, thumbs, bar, lightbox.dialog);
  show(0);
  setPlaying(playing);

  // autoplay only while the gallery is on screen
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    startTimer();
  }).observe(block);
}
