import { describe, expect, it } from 'vitest';
import { editTable, pointsToPath, safeImageName, uniqueImageName } from './media';

describe('pointsToPath', () => {
  it('drops points on a straight line', () => {
    expect(pointsToPath([{ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 10, y: 10 }])).toBe('M0 0 L10 10');
  });

  it('keeps a corner', () => {
    expect(pointsToPath([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }])).toBe('M0 0 L10 0 L10 10');
  });

  it('ignores wobble under a pixel', () => {
    expect(pointsToPath([{ x: 0, y: 0 }, { x: 5, y: 0.6 }, { x: 10, y: 0 }])).toBe('M0 0 L10 0');
  });
});

describe('image names', () => {
  it('makes a file name safe for the slide folder', () => {
    expect(safeImageName('My Logo.PNG')).toBe('my-logo.png');
    expect(safeImageName('Über (final) v2.jpeg')).toBe('ber-final-v2.jpeg');
    expect(safeImageName('a..b...png')).toBe('a.b.png');
  });

  it('refuses types other than images', () => {
    expect(safeImageName('notes.pdf')).toBeNull();
  });

  it('numbers a name that is taken', async () => {
    const taken = new Set(['my-logo.png', 'my-logo-2.png']);
    expect(await uniqueImageName('my-logo.png', async n => taken.has(n))).toBe('my-logo-3.png');
    expect(await uniqueImageName('free.gif', async n => taken.has(n))).toBe('free.gif');
  });
});

describe('editTable', () => {
  const html = '<table><tbody><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></tbody></table>';
  const count = (h: string, tag: string) => (h.match(new RegExp(`<${tag}>`, 'g')) ?? []).length;

  it('adds and removes rows', () => {
    expect(count(editTable(html, 'add-row'), 'tr')).toBe(3);
    expect(count(editTable(html, 'remove-row'), 'tr')).toBe(1);
  });

  it('adds and removes columns in every row', () => {
    const wider = editTable(html, 'add-column');
    expect([count(wider, 'th'), count(wider, 'td')]).toEqual([3, 3]);
    const narrower = editTable(html, 'remove-column');
    expect([count(narrower, 'th'), count(narrower, 'td')]).toEqual([1, 1]);
  });

  it('keeps at least one row and one column', () => {
    const one = '<table><tbody><tr><td>x</td></tr></tbody></table>';
    expect(editTable(editTable(one, 'remove-row'), 'remove-column')).toBe(one);
  });
});
