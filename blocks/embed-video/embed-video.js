/**
 * Embed Video: responsive 16:9 video player (YouTube, Vimeo, or any embeddable URL).
 * Authored content: the video URL, plus an optional placeholder image that
 * loads the player on click. Without a placeholder the player loads lazily
 * when the block scrolls into view.
 */

const frame = (src, title, allow) => `<div class="embed-video-frame">
    <iframe src="${src}" allow="${allow}" allowfullscreen="" title="${title}" loading="lazy"></iframe>
  </div>`;

function youtubeSrc(url, autoplay) {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v') || '';
  if (url.hostname.includes('youtu.be')) [, vid] = url.pathname.split('/');
  if (!vid && url.pathname.startsWith('/embed/')) [, , vid] = url.pathname.split('/');
  const suffix = autoplay ? '&mute=1&autoplay=1' : '';
  if (!vid) return url.href;
  return `https://www.youtube.com/embed/${encodeURIComponent(vid)}?rel=0${suffix}`;
}

function vimeoSrc(url, autoplay) {
  const video = url.pathname.split('/').filter(Boolean).pop();
  return `https://player.vimeo.com/video/${video}${autoplay ? '?muted=1&autoplay=1' : ''}`;
}

function loadVideo(block, link, autoplay) {
  if (block.classList.contains('embed-video-is-loaded')) return;
  const url = new URL(link, window.location.href);
  const allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  if (/youtube|youtu\.be/.test(url.hostname)) {
    block.innerHTML = frame(youtubeSrc(url, autoplay), 'Content from YouTube', allow);
    block.classList.add('embed-video-youtube');
  } else if (/vimeo/.test(url.hostname)) {
    block.innerHTML = frame(vimeoSrc(url, autoplay), 'Content from Vimeo', allow);
    block.classList.add('embed-video-vimeo');
  } else {
    block.innerHTML = frame(url.href, `Content from ${url.hostname}`, allow);
  }
  block.classList.add('embed-video-is-loaded');
}

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const anchor = block.querySelector('a[href]');
  const iframe = block.querySelector('iframe[src]');
  const link = anchor?.href || iframe?.src
    || [...block.querySelectorAll('div, p')].map((el) => el.textContent.trim()).find((t) => /^https?:\/\//.test(t));
  block.textContent = '';
  if (!link) return;

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-video-placeholder';
    wrapper.innerHTML = '<div class="embed-video-placeholder-play"><button type="button" title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => loadVideo(block, link, true));
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadVideo(block, link);
      }
    });
    observer.observe(block);
  }
}
