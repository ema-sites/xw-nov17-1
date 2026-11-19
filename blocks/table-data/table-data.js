import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Table Data: bordered data table with a header row and text rows.
 * Each authored row is a table row; the first row is the header unless the
 * `no-header` option is set. Wide tables scroll horizontally on small screens.
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const header = !block.classList.contains('no-header');

  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    moveInstrumentation(row, tr);
    [...row.children].forEach((cell) => {
      const isHead = i === 0 && header;
      const td = document.createElement(isHead ? 'th' : 'td');
      if (isHead) td.setAttribute('scope', 'col');
      td.innerHTML = cell.innerHTML;
      tr.append(td);
    });
    if (i === 0 && header) thead.append(tr);
    else tbody.append(tr);
  });

  if (thead.children.length) table.append(thead);
  table.append(tbody);

  const wrapper = document.createElement('div');
  wrapper.className = 'table-data-scroll';
  wrapper.append(table);
  block.replaceChildren(wrapper);
}
