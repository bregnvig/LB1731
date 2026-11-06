import { describe, expect, it } from 'vitest';
import { LINE_SPEC, newBlock } from './new-block';

describe('newBlock', () => {
  it('takes the first free name', () => {
    expect(newBlock('code', ['code-1', 'code-3'], { x: 0, y: 0 }, 1).name).toBe('code-2');
  });

  it('makes an arrow a line with an arrowhead at the end', () => {
    const b = newBlock('arrow', [], { x: 0, y: 0 }, 1);
    expect(b).toMatchObject({ type: 'line', name: 'arrow-1', end: 'arrow', start: 'none' });
  });

  it('keeps the block on the slide', () => {
    const b = newBlock('shape', [], { x: 1250, y: -40 }, 1);
    expect([b.x, b.y]).toEqual([1280 - 200, 0]);
  });

  it('puts the block on top', () => {
    expect(newBlock('text', [], { x: 0, y: 0 }, 7).z).toBe(7);
  });
});

describe('LINE_SPEC', () => {
  it.each(['', '2', '2,4', '6-8', '1|3,4', '|9|10,13|16,17|24'])('accepts %j', v => expect(LINE_SPEC.test(v)).toBe(true));
  it.each(['a', '2,', '1-', '1||2x', ' 2'])('rejects %j', v => expect(LINE_SPEC.test(v)).toBe(false));
});
