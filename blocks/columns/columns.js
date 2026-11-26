/**
 * News variant (`columns (news)`): homepage area pairing a news list (heading, teaser titles with
 * summaries and "Read more" links) with quick-link and council link lists.
 * Each cell is one column; each row is one band of columns.
 * A cell made mainly of one long link list is flowed into two list columns.
 *
 * Universal Editor / md2jcr turns a heading that only holds a link into a button
 * (`<p><a>`), so a link-only paragraph in the news feed that is not a "Read more" link
 * is rebuilt as the teaser's h3 title.
 */
function decorateNews(block) {
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
        return;
      }
      cell.classList.add('columns-news-feed');
      cell.querySelectorAll(':scope > p').forEach((p) => {
        const link = p.querySelector(':scope > a:only-child');
        if (!link || p.textContent.trim() !== link.textContent.trim()) return;
        if (/^read more$/i.test(link.textContent.trim())) {
          p.classList.add('columns-news-more');
          return;
        }
        const h3 = document.createElement('h3');
        link.classList.remove('button');
        h3.append(link);
        p.replaceWith(h3);
      });
      cell.querySelectorAll(':scope > p.button-container').forEach((p) => {
        p.classList.remove('button-container');
        p.querySelector('a.button')?.classList.remove('button');
      });
    });
  });
}

export default function decorate(block) {
  if (block.classList.contains('news')) {
    decorateNews(block);
    return;
  }

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
