import { describe, expect, it } from 'vitest';
import { highlightCode, scrollToHighlights } from './highlight';

const block = (code: string, attrs = '') => {
  document.body.innerHTML = `<div class="block" data-type="code"><pre><code class="language-typescript" ${attrs}></code></pre></div>`;
  document.querySelector('code')!.textContent = code;
  highlightCode(document.body);
  return document.querySelector('code')!;
};

describe('highlightCode', () => {
  it('highlights tokens', () => {
    const code = block('export class A {}');
    expect(code.classList.contains('hljs')).toBe(true);
    expect(code.querySelector('.hljs-keyword')!.textContent).toBe('export');
  });

  it('builds a numbered row per line when data-line-numbers is set', () => {
    const code = block('a\nb\nc', 'data-line-numbers=""');
    const rows = code.querySelectorAll('table.hljs-ln tr');
    expect(rows.length).toBe(3);
    expect([...code.querySelectorAll('.hljs-ln-n')].map(n => n.getAttribute('data-line-number'))).toEqual(['1', '2', '3']);
    expect(rows[1].querySelector('td.hljs-ln-code > div.hljs-ln-line')!.textContent).toBe('b');
  });

  it('marks highlighted lines', () => {
    const code = block('a\nb\nc\nd', 'data-line-numbers="2,3-4"');
    expect(code.classList.contains('has-highlights')).toBe(true);
    expect([...code.querySelectorAll('tr')].map(r => r.classList.contains('highlight-line'))).toEqual([false, true, true, true]);
  });

  it('closes and reopens a token that spans lines so every row is balanced', () => {
    const code = block('const s = `a\nb`;', 'data-line-numbers=""');
    const lines = [...code.querySelectorAll('td.hljs-ln-code > div')];
    expect(lines.map(l => l.textContent)).toEqual(['const s = `a', 'b`;']);
    expect(lines[1].querySelector('.hljs-string')!.textContent).toBe('b`');
  });

  it('turns stepped highlights into fragment copies of the code', () => {
    block('a\nb\nc\nd', 'data-line-numbers="1|3,4"');
    const codes = [...document.querySelectorAll('pre > code')];
    expect(codes.length).toBe(2);
    expect(codes[0].classList.contains('fragment')).toBe(false);
    expect([...codes[0].querySelectorAll('tr')].map(r => r.classList.contains('highlight-line'))).toEqual([true, false, false, false]);
    expect(codes[1].classList.contains('fragment')).toBe(true);
    expect(codes[1].getAttribute('data-line-numbers')).toBe('3,4');
    expect([...codes[1].querySelectorAll('tr')].map(r => r.classList.contains('highlight-line'))).toEqual([false, false, true, true]);
  });

  it('does not dim the code when the highlighted lines are past its end', () => {
    expect(block('a\nb', 'data-line-numbers="12-14"').classList.contains('has-highlights')).toBe(false);
  });

  it('treats an empty step as no highlighted lines', () => {
    block('a\nb', 'data-line-numbers="|2"');
    const codes = [...document.querySelectorAll('pre > code')];
    expect(codes[0].classList.contains('has-highlights')).toBe(false);
    expect(codes[1].classList.contains('has-highlights')).toBe(true);
  });

  it('scrolls the code so the highlighted lines are centred', () => {
    const code = block(Array.from({ length: 30 }, (_, i) => `line ${i}`).join('\n'), 'data-line-numbers="11"');
    const set = (el: Element, props: Record<string, number>) =>
      Object.entries(props).forEach(([k, v]) => Object.defineProperty(el, k, { configurable: true, value: v }));
    set(code, { offsetHeight: 100, scrollHeight: 600 });
    set(code.querySelector('table')!, { offsetTop: 0 });
    set(code.querySelector('tr.highlight-line')!, { offsetTop: 200, offsetHeight: 20 });
    scrollToHighlights(code);
    expect(code.scrollTop).toBe(160);
  });

  it('does not carry a token with nested tokens onto the next line', () => {
    document.body.innerHTML = '<div class="block" data-type="code"><pre><code class="language-html" data-line-numbers=""></code></pre></div>';
    document.querySelector('code')!.textContent = '<input\n  id="name">';
    highlightCode(document.body);
    const second = document.querySelectorAll('td.hljs-ln-code > div')[1];
    expect(second.querySelector('.hljs-attr')!.closest('.hljs-tag')).toBeNull();
    expect(second.textContent).toBe('  id="name">');
  });

  it('ignores a trailing newline', () => {
    expect(block('a\nb\n', 'data-line-numbers=""').querySelectorAll('tr').length).toBe(2);
  });

  it('leaves code without line numbers as plain highlighted text', () => {
    expect(block('a\nb').querySelector('table')).toBeNull();
  });
});
