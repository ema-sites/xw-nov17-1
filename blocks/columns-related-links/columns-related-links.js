/**
 * Columns Related Links: side-by-side link groups (e.g. "Related Documents",
 * "Related Links"), each a heading above a bulleted list of links.
 * One row; one cell per group.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-related-links-row');
    [...row.children].forEach((cell) => {
      if (!cell.textContent.trim()) {
        cell.remove();
        return;
      }
      cell.classList.add('columns-related-links-group');
    });
    row.classList.add(`columns-related-links-${row.children.length}-cols`);
  });
}
