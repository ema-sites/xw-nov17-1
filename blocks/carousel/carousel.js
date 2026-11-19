import { moveInstrumentation } from '../../scripts/scripts.js';
import { fetchPlaceholders } from '../../scripts/placeholders.js';

const AUTOPLAY_DELAY = 5000;

export function showSlide(block, slideIndex = 0) {
  const slides = [...block.querySelectorAll('.carousel-slide')];
  if (!slides.length) return;
  let index = slideIndex;
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = 0;
  block.dataset.activeSlide = index;

  slides.forEach((slide, idx) => {
    const active = idx === index;
    slide.classList.toggle('carousel-slide-active', active);
    slide.setAttribute('aria-hidden', !active);
    // hidden slides never load lazy images: load the active and the next one ahead of the fade
    if (active || idx === (index + 1) % slides.length) {
      slide.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
    }
    slide.querySelectorAll('a').forEach((link) => {
      if (active) link.removeAttribute('tabindex');
      else link.setAttribute('tabindex', '-1');
    });
  });

  block.querySelectorAll('.carousel-slide-indicator button').forEach((button, idx) => {
    if (idx === index) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

function bindEvents(block) {
  const indicators = block.querySelector('.carousel-slide-indicators');
  indicators.addEventListener('click', (e) => {
    const indicator = e.target.closest('.carousel-slide-indicator');
    if (!indicator) return;
    showSlide(block, parseInt(indicator.dataset.targetSlide, 10));
  });

  // source: jQuery cycle fade, timeout 5s; pauses while the user hovers or focuses the banner
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let timer;
  const stop = () => {
    clearInterval(timer);
    timer = undefined;
  };
  const start = () => {
    stop();
    timer = setInterval(() => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    }, AUTOPLAY_DELAY);
  };
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', () => {
    if (!block.contains(document.activeElement)) start();
  });
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', (e) => {
    if (!block.contains(e.relatedTarget) && !block.matches(':hover')) start();
  });
  start();
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const content = slide.querySelector('.carousel-slide-content');
  if (content) {
    // the slide's link target ("Learn More") makes the whole slide clickable
    const links = [...content.querySelectorAll('a[href]')];
    const link = links[links.length - 1];
    let linkWrap;
    if (link) {
      link.classList.remove('button', 'primary', 'secondary');
      link.classList.add('carousel-slide-link');
      linkWrap = link.closest('p');
      if (linkWrap && linkWrap.textContent.trim() === link.textContent.trim()) {
        linkWrap.classList.remove('button-container');
        linkWrap.classList.add('carousel-slide-link-wrap');
      } else {
        linkWrap = null;
      }
    }
    const hasCaption = content.querySelector('h1, h2, h3, h4, h5, h6')
      || [...content.querySelectorAll('p')].some((p) => p !== linkWrap && p.textContent.trim());
    if (hasCaption) content.classList.add('carousel-slide-caption');
  }

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy?.id) {
    slide.setAttribute('aria-labelledby', labeledBy.id);
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.classList.add('carousel-slide-indicators-nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    container.append(slideIndicatorsNav);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.prepend(slidesWrapper);
  block.prepend(container);

  showSlide(block, 0);
  if (!isSingleSlide) {
    bindEvents(block);
  }
}
