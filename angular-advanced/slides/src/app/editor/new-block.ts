import { Block } from '../deck/model';

/** The deck's accent color (--deck-accent in deck.css), used to fill new shapes. */
export const ACCENT = '#e7ad52';

/** Highlighted lines: steps separated by |, each empty or a list of lines and ranges ("|2|4-6,9"). */
export const LINE_SPEC = /^(\d+(-\d+)?(,\d+(-\d+)?)*)?(\|(\d+(-\d+)?(,\d+(-\d+)?)*)?)*$/;

export type NewBlockType = 'text' | 'code' | 'shape' | 'line' | 'arrow';

const clamp = (v: number, max: number) => Math.round(Math.max(0, Math.min(v, max)));

/** A new block of `type` at `at` (top left, kept on the slide), named `<type>-<n>` with the first free n, at depth `z`. */
export function newBlock(type: NewBlockType, existing: string[], at: { x: number; y: number }, z: number): Block {
  let n = 1;
  while (existing.includes(`${type}-${n}`)) n++;
  const name = `${type}-${n}`;
  const place = (width: number, height: number) => ({ name, z, width, height, x: clamp(at.x, 1280 - width), y: clamp(at.y, 720 - height) });
  switch (type) {
    case 'text':
      return { type, ...place(600, 0), height: 'auto', html: '<p>Text</p>' };
    case 'code':
      return { type, ...place(786, 159), code: '', lang: 'typescript', theme: 'dark', frame: 'none', lines: null, autoHeight: false, preStyle: 'font-size: 20px; line-height: 24px;' };
    case 'shape':
      return { type, ...place(200, 120), shape: 'rect', fill: ACCENT, stroke: null, strokeWidth: 0, radius: 0 };
    case 'line':
    case 'arrow':
      return { type: 'line', ...place(200, 0), x1: 0, y1: 0, x2: 200, y2: 0, color: '#ffffff', thickness: 5, dashed: false, start: 'none', end: type === 'arrow' ? 'arrow' : 'none' };
  }
}
