/**
 * Notice: bordered callout with an icon beside a status / info message.
 * Authored content: an optional icon (image or :icon:) and a rich-text message,
 * either in two cells of one row or in two rows. Everything that is not the
 * icon becomes the message body.
 */
export default function decorate(block) {
  const icon = block.querySelector('picture, span.icon');
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'notice-icon';
  iconWrapper.setAttribute('aria-hidden', 'true');

  if (icon) {
    const iconParent = icon.parentElement;
    iconWrapper.append(icon);
    // drop the now-empty paragraph that held the icon
    if (iconParent && iconParent.tagName === 'P' && !iconParent.textContent.trim() && !iconParent.children.length) {
      iconParent.remove();
    }
  }

  const body = document.createElement('div');
  body.className = 'notice-body';
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    while (cell.firstChild) body.append(cell.firstChild);
  });

  block.textContent = '';
  if (icon) block.append(iconWrapper);
  else block.classList.add('notice-no-icon');
  block.append(body);
  block.setAttribute('role', 'note');
}
