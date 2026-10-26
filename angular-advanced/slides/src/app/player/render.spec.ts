import { describe, expect, it } from 'vitest';
import { Block, Course, Deck, Slide } from '../deck/model';
import { deckHtml } from './deck-html';
import { renderBlock, renderSlide } from './render';

const base = { name: 'b', x: 10, y: 20, width: 140, height: 120 as number | 'auto', z: 3 };
const dom = (html: string) => new DOMParser().parseFromString(html, 'text/html').body;
const slide = (path: string, blocks: Block[] = [], extra: Partial<Slide> = {}): Slide =>
  ({ path, hidden: false, autoAnimate: false, blocks, notes: '', etag: '', ...extra });

describe('renderBlock', () => {
  it('draws a line with one arrowhead at the start', () => {
    const el = dom(renderBlock({ ...base, type: 'line', x1: 0, y1: 0, x2: 140, y2: 120, color: '#ff0000', thickness: 5,
      dashed: false, start: 'arrow', end: 'none' }, '/content/x')).firstElementChild!;
    const svg = el.querySelector('svg')!;
    expect(svg).toBeTruthy();
    expect(svg.querySelectorAll('path[data-line]').length).toBe(1);
    expect(svg.querySelectorAll('path[data-arrow="start"]').length).toBe(1);
    expect(svg.querySelectorAll('path[data-arrow="end"]').length).toBe(0);
    expect(svg.querySelector('path[data-line]')!.getAttribute('stroke')).toBe('#ff0000');
  });

  it('shortens the line at an arrow and places the arrow tip like the deck', () => {
    const el = dom(renderBlock({ ...base, width: 720, height: 0, type: 'line', x1: 0, y1: 0, x2: 720, y2: 0, color: '#fff', thickness: 7,
      dashed: false, start: 'none', end: 'arrow' }, '')).firstElementChild!;
    expect(el.querySelector('path[data-line]')!.getAttribute('d')).toBe('M0 0 L713 0');
    expect(el.querySelector('path[data-arrow="end"]')!.getAttribute('d')).toBe('M 700 -15.75 L 715.75 0 L 700 15.75 L 715.75 0');
  });

  it('draws a circle that fills its box', () => {
    const el = dom(renderBlock({ ...base, type: 'shape', shape: 'circle', fill: '#222', stroke: null, strokeWidth: 0, radius: 0 }, '')).firstElementChild!;
    const ellipse = el.querySelector('ellipse')!;
    expect([ellipse.getAttribute('cx'), ellipse.getAttribute('cy'), ellipse.getAttribute('rx'), ellipse.getAttribute('ry')]).toEqual(['70', '60', '70', '60']);
    expect(el.querySelector('svg')!.getAttribute('viewBox')).toBe('0 0 140 120');
  });

  it('points image sources at the slide folder on the content route', () => {
    const el = dom(renderBlock({ ...base, type: 'image', src: 'images/a.png', alt: 'A', inlineSvg: false, svgColor: null, imgStyle: '', keepRatio: true },
      '/content/courses/rxjs/slides')).firstElementChild!;
    expect(el.querySelector('img')!.getAttribute('src')).toBe('/content/courses/rxjs/slides/images/a.png');
  });

  it('renders code for the highlighter with line numbers', () => {
    const el = dom(renderBlock({ ...base, type: 'code', code: 'a < b', lang: 'typescript', theme: 'dark', frame: 'none', lines: '2,3',
      autoHeight: false, preStyle: 'font-size:20px' }, '')).firstElementChild!;
    const code = el.querySelector('pre > code')!;
    expect(code.className).toBe('language-typescript');
    expect(code.getAttribute('data-line-numbers')).toBe('2,3');
    expect(code.textContent).toBe('a < b');
  });

  it('renders a linked block as an anchor opening a new tab', () => {
    const el = dom(renderBlock({ ...base, type: 'text', html: '<p>x</p>', href: 'https://example.com' }, '')).firstElementChild!;
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('https://example.com');
    expect(el.getAttribute('target')).toBe('_blank');
  });
});

describe('renderSlide', () => {
  it('marks hidden slides and keeps notes', () => {
    const el = dom(renderSlide(slide('courses/rxjs/slides/x.html', [], { hidden: true, notes: 'Say <hi>' }), '/content/courses/rxjs/slides')).firstElementChild!;
    expect(el.getAttribute('data-visibility')).toBe('hidden');
    expect(el.querySelector('aside.notes')!.textContent).toBe('Say <hi>');
  });
});

describe('deckHtml', () => {
  it('puts intro slides at the top level and one stack per course', () => {
    const course = (id: string): Course => ({ id, title: id, slides: [slide(`courses/${id}/slides/a.html`), slide(`courses/${id}/slides/b.html`)] });
    const deck: Deck = { title: 'T', intro: [slide('slides/intro/a.html'), slide('slides/intro/b.html')], courses: [course('one'), course('two')] };
    const top = [...dom(deckHtml(deck)).children];
    expect(top.length).toBe(4);
    expect(top.map(s => s.querySelectorAll(':scope > section').length)).toEqual([0, 0, 2, 2]);
  });
});
