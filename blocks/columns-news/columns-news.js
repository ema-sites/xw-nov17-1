/**
 * Columns News: homepage area pairing a news list (heading, teaser titles with
 * summaries and "Read more" links) with quick-link and council link lists.
 * Each cell is one column; each row is one band of columns.
 * A cell made mainly of one long link list is flowed into two list columns.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-news-row');
    const cells = [...row.children]
      .filter((cell) => cell.textContent.trim() || cell.children.length);
    row.classList.add(`columns-news-${cells.length}-cols`);
    [...row.children].forEach((cell) => {
      if (!cell.textContent.trim() && !cell.children.length) {
        cell.remove();
        return;
      }
      cell.classList.add('columns-news-col');
      const lists = cell.querySelectorAll(':scope > ul');
      if (lists.length) {
        cell.classList.add('columns-news-links');
        lists.forEach((ul) => {
          if (ul.children.length > 5) ul.classList.add('columns-news-links-split');
        });
      } else {
        cell.classList.add('columns-news-feed');
      }
    });
  });
}
