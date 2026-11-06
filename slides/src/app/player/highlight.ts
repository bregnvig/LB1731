import hljs from 'highlight.js';

// Code blocks are highlighted with highlight.js 10.0.3: newer versions tokenize differently,
// which changes how the deck's code looks. With data-line-numbers the code becomes a table of
// numbered rows; "2,4-6" marks highlighted lines and dims the rest (reveal.css).

const NEWLINE = /\r\n|\r|\n/g;
const breaks = (text: string) => (text.trim().match(NEWLINE) ?? []).length;

/**
 * Copies a token onto every line it covers, so each line keeps its colour. Like the line splitting
 * the deck's code was made with, only tokens whose own text crosses a line break are copied: a break
 * that is just whitespace between two tokens (an HTML tag's attributes on separate lines) is not,
 * which leaves those attributes outside the tag token on later lines.
 */
function copyMultilineTokens(el: Element): void {
  for (const child of [...el.childNodes]) {
    if (!breaks(child.textContent ?? '')) continue;
    if (child.childNodes.length) copyMultilineTokens(child as Element);
    else if (/hljs-/.test(el.className)) {
      el.innerHTML = el.innerHTML.split(NEWLINE).map(line => `<span class="${el.className}">${line || ' '}</span>\n`).join('').trim();
      return;
    }
  }
}

/** Splits highlighted HTML into lines; each row's HTML is completed by the browser when inserted. */
function splitLines(code: HTMLElement): string[] {
  copyMultilineTokens(code);
  const lines = code.innerHTML.split(NEWLINE);
  if (lines.length > 1 && lines[lines.length - 1].trim() === '') lines.pop();
  return lines.map(line => line || ' ');
}

function highlightedLines(spec: string): Set<number> {
  const set = new Set<number>();
  for (const part of spec.split(',').map(p => p.trim()).filter(Boolean)) {
    const [from, to = from] = part.split('-').map(Number);
    for (let n = from; n <= to; n++) set.add(n);
  }
  return set;
}

function markLines(code: HTMLElement, step: string) {
  const marked = highlightedLines(step);
  code.setAttribute('data-line-numbers', step);
  const rows = [...code.querySelectorAll('tr')];
  rows.forEach((row, i) => row.classList.toggle('highlight-line', marked.has(i + 1)));
  // Lines past the end highlight nothing, so nothing is dimmed either.
  code.classList.toggle('has-highlights', rows.some(row => row.classList.contains('highlight-line')));
}

export function highlightCode(root: ParentNode): void {
  for (const code of root.querySelectorAll<HTMLElement>('.block[data-type="code"] pre > code:not(.hljs)')) {
    hljs.highlightBlock(code);
    const spec = code.getAttribute('data-line-numbers');
    if (spec == null) continue;
    const rows = splitLines(code).map((line, i) =>
      '<tr>'
      + `<td class="hljs-ln-numbers"><div class="hljs-ln-line hljs-ln-n" data-line-number="${i + 1}"></div></td>`
      + `<td class="hljs-ln-code"><div class="hljs-ln-line">${line}</div></td></tr>`);
    code.innerHTML = `<table class="hljs-ln"><tbody>${rows.join('')}</tbody></table>`;
    // "1|3,4" highlights in steps: each step after the first is a copy of the code shown as a fragment.
    const [first, ...rest] = spec.split('|');
    for (const step of rest) {
      const copy = code.cloneNode(true) as HTMLElement;
      copy.classList.add('fragment');
      markLines(copy, step);
      code.parentElement!.appendChild(copy);
    }
    markLines(code, first);
  }
}

/** Scrolls a code block so its highlighted lines sit in the middle of the visible area, as reveal.js does. */
export function scrollToHighlights(code: HTMLElement): void {
  const rows = code.querySelectorAll<HTMLElement>('tr.highlight-line');
  const top = rows.length ? rows[0].offsetTop : 0;
  const bottom = rows.length ? rows[rows.length - 1].offsetTop + rows[rows.length - 1].offsetHeight : 0;
  const style = getComputedStyle(code);
  const padTop = parseInt(style.paddingTop) || 0;
  const visible = code.offsetHeight - padTop - (parseInt(style.paddingBottom) || 0);
  let scroll = top + (Math.min(bottom - top, visible) - visible) / 2;
  const table = code.querySelector<HTMLElement>('.hljs-ln');
  if (table) scroll += table.offsetTop - padTop;
  code.scrollTop = Math.max(Math.min(scroll, code.scrollHeight - visible), 0);
}
