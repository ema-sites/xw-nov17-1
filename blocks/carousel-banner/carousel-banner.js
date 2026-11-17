import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';

const AUTOPLAY_INTERVAL = 6000;

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel-banner');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  block.querySelectorAll('.carousel-banner-slide').forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });

  block.querySelectorAll('.carousel-banner-slide-indicator button').forEach((button, idx) => {
    if (idx !== slideIndex) {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    } else {
      button.setAttribute('disabled', 'true');
      button.setAttribute('aria-current', 'true');
    }
  });
}

export function showSlide(block, slideIndex = 0, behavior = 'smooth') {
  const slides = block.querySelectorAll('.carousel-banner-slide');
  if (!slides.length) return;
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-banner-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior,
  });
}

function startAutoplay(block) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let timer;
  const stop = () => {
    clearInterval(timer);
    timer = undefined;
  };
  const start = () => {
    stop();
    timer = setInterval(() => {
      showSlide(block, parseInt(block.dataset.activeSlide || '0', 10) + 1);
    }, AUTOPLAY_INTERVAL);
  };

  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', (e) => {
    if (!block.contains(e.relatedTarget)) start();
  });
  start();
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-banner-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-banner-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-banner-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-banner-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-banner-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  // Drop an empty text cell so image-only banners carry no overlay box.
  const content = slide.querySelector('.carousel-banner-slide-content');
  if (content && !content.textContent.trim() && !content.querySelector('img')) {
    content.remove();
  } else if (content) {
    // A lone link in the text cell makes the whole banner clickable.
    const links = content.querySelectorAll('a[href]');
    if (links.length === 1) slide.dataset.href = links[0].href;
  }

  const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && heading.id) {
    slide.setAttribute('aria-labelledby', heading.id);
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-banner-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  const { carousel: roleDescription } = placeholders;
  block.setAttribute('aria-roledescription', roleDescription || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-banner-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-banner-slides');

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.classList.add('carousel-banner-slide-indicators-nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-banner-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    container.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-banner-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;
    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-banner-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  slidesWrapper.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 900px)', width: '2000' }, { width: '900' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Clicking anywhere on a single-link banner follows that link.
  slidesWrapper.querySelectorAll('.carousel-banner-slide[data-href]').forEach((slide) => {
    slide.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      window.location.href = slide.dataset.href;
    });
  });

  container.prepend(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
    startAutoplay(block);
  }
}
