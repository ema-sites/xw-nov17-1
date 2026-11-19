/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-video.
 * Source: https://www.cnv.org (content-page-sidebar)
 * Selector: .infoPanel div.iframeWrapper (plus per-page roots that wrap an <iframe>)
 * Model: embed-video { embed_placeholder (reference), embed_placeholderAlt (collapsed),
 *   embed_uri (text) } - the embed_* fields share one cell.
 * One row, one cell: [placeholder image (optional) + video URL link].
 *
 * Not content (no block emitted, root removed): reCAPTCHA wrappers (the catalog cached
 * those as embed-video samples, but they belong to the form) and the blank council
 * video player target (video_blank.html), which the video-date-select block replaces.
 */

const NON_CONTENT = /recaptcha|video_blank\.html|about:blank/i;

export default function parse(element, { document }) {
  const frames = [element.matches('iframe') ? element : null, ...element.querySelectorAll('iframe')]
    .filter(Boolean)
    .filter((f) => {
      const src = f.getAttribute('src') || f.getAttribute('data-src') || '';
      return src && !NON_CONTENT.test(src) && !NON_CONTENT.test(f.getAttribute('title') || '');
    });

  let src = frames.length ? (frames[0].getAttribute('src') || frames[0].getAttribute('data-src')) : null;
  if (!src) {
    const video = element.querySelector('video[src], video source[src]');
    if (video) src = video.getAttribute('src');
  }

  if (!src) {
    // Nothing embeddable (e.g. reCAPTCHA widget): drop the runtime widget.
    element.remove();
    return;
  }
  if (src.startsWith('//')) src = `https:${src}`;
  const title = frames.length ? (frames[0].getAttribute('title') || '').trim() : '';

  const frag = document.createDocumentFragment();
  const poster = element.querySelector('img[src]');
  if (poster) {
    frag.appendChild(document.createComment(' field:embed_placeholder '));
    const img = document.createElement('img');
    img.setAttribute('src', poster.getAttribute('src'));
    img.setAttribute('alt', poster.getAttribute('alt') || title);
    frag.appendChild(img);
  }
  frag.appendChild(document.createComment(' field:embed_uri '));
  const a = document.createElement('a');
  a.setAttribute('href', src);
  a.textContent = src;
  frag.appendChild(a);

  const cells = [[frag]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
