/**
 * Video Date Select: the "Select a Date" dropdown that opens a council meeting video.
 * Authored content:
 *   row 1 (optional): label text (default "Select a Date:")
 *   next row: a list of links — each link text is a meeting date, its URL the video.
 * Choosing a date opens that video (links authored with a new-window target
 * open in a new tab).
 */

let videoDateSelectCount = 0;

export default function decorate(block) {
  videoDateSelectCount += 1;
  const selectId = `video-date-select-${videoDateSelectCount}`;
  const links = [...block.querySelectorAll('a[href]')];

  // label: first text that is not one of the date links
  let labelText = '';
  [...block.querySelectorAll(':scope > div > div')].some((cell) => {
    if (cell.querySelector('a[href]')) return false;
    labelText = cell.textContent.trim();
    return !!labelText;
  });

  const label = document.createElement('label');
  label.className = 'video-date-select-label';
  label.htmlFor = selectId;
  // source markup: <label>Select a Date: <select>…</select></label>
  label.append(`${labelText || 'Select a Date:'} `);

  const select = document.createElement('select');
  select.id = selectId;
  select.className = 'video-date-select-control';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select a date ...';
  select.append(placeholder);

  links.forEach((a) => {
    const option = document.createElement('option');
    option.value = a.href;
    option.textContent = a.textContent.trim();
    if (a.target === '_blank') option.dataset.newWindow = 'true';
    select.append(option);
  });

  select.addEventListener('change', () => {
    const option = select.selectedOptions[0];
    if (!option || !option.value) return;
    if (option.dataset.newWindow) window.open(option.value, '_blank', 'noopener');
    else window.location.href = option.value;
  });

  label.append(select);
  block.replaceChildren(label);
}
