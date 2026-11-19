/**
 * Columns Feature: a fixed two-column pair — a text panel (heading, paragraph,
 * bullets or link) beside a large image. Either cell order is allowed.
 * Option `image-left-boxed-text`: image first, text in a boxed panel.
 */
export default function decorate(block) {
  const cols = [...(block.firstElementChild?.children || [])];
  block.classList.add(`columns-feature-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-feature-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        col.classList.add('columns-feature-img-col');
      } else {
        col.classList.add('columns-feature-text-col');
      }
    });
  });
}
