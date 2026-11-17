/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for www.cnv.org (ASP.NET / Sitecore).
 * Selectors taken from migration-work/cleaned.html.
 */

function isEmpty(el) {
  if (!el) return false;
  if (el.querySelector('img, picture, video, iframe, a[href], input, table')) return false;
  return el.textContent.replace(/ /g, ' ').trim() === '';
}

export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Global header: direct div.container child of the form (live: #mainform > div:nth-child(8))
    WebImporter.DOMUtils.remove(element, [
      '#mainform > div:nth-child(8):not(#content-columns):not(#footer-background)',
      '#mainform > div.container',
    ]);

    // Global footer
    WebImporter.DOMUtils.remove(element, [
      '#footer-background',
      'div.footer-middle-section',
    ]);

    // ASP.NET hidden-field wrappers and float-clearing spacers
    WebImporter.DOMUtils.remove(element, [
      '.aspNetHidden',
      'div.clear',
    ]);

    // Slideshow dot pager (non-authorable navigation chrome)
    WebImporter.DOMUtils.remove(element, ['.slideshowPager']);

    // Google Translate overlays / widgets appended to body
    WebImporter.DOMUtils.remove(element, [
      '#google_translate_element',
      '#goog-gt-tt',
      '.skiptranslate',
      '[class^="VIpgJd-"]',
      'iframe',
    ]);

    // Empty info panels and empty h1 inside home page content
    element.querySelectorAll('.home-page-content .infoPanel').forEach((panel) => {
      if (isEmpty(panel)) panel.remove();
    });
    element.querySelectorAll('.home-page-content h1').forEach((h1) => {
      if (isEmpty(h1)) h1.remove();
    });
    // Empty feature listing placeholder inside home page content
    element.querySelectorAll('.home-page-content .featureCTAs').forEach((el) => {
      if (isEmpty(el)) el.remove();
    });

    // News panel title is a styled <div> on the source; author it as an h2 heading
    element.querySelectorAll('.homeNewsPanel .firstLineTitle').forEach((title) => {
      const h2 = element.ownerDocument.createElement('h2');
      h2.textContent = title.textContent.trim();
      title.replaceWith(h2);
    });
  }

  if (hookName === 'afterTransform') {
    WebImporter.DOMUtils.remove(element, [
      'script',
      'style',
      'noscript',
      'link',
      'iframe',
      'form#goog-gt-votingForm',
      '.widgetsAfterContent',
    ]);

    // Strip tracking / framework attributes
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const n = attr.name;
        if (n.startsWith('data-track') || n.startsWith('data-analytics') || n === 'onclick' || n === 'onload') {
          el.removeAttribute(n);
        }
      });
    });
  }
}
