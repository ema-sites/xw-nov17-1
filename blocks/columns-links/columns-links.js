export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;
  const cols = [...firstRow.children];
  block.classList.add(`columns-links-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.classList.add('columns-links-group');
      // Long link lists flow into two sub-columns via CSS.
      col.querySelectorAll(':scope > ul').forEach((ul) => {
        ul.classList.add('columns-links-list');
        if (ul.children.length > 5) ul.classList.add('columns-links-list-split');
      });
    });
  });
}
