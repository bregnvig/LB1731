import { describe, expect, it } from 'vitest';
import { snap } from './guides';

describe('snap', () => {
  it('pulls a left edge onto a nearby left edge', () => {
    const r = snap({ x: 103, y: 300, width: 50, height: 50 }, [{ x: 100, y: 0, width: 80, height: 40 }]);
    expect(r.dx).toBe(-3);
    expect(r.guides).toContainEqual({ axis: 'x', at: 100 });
  });

  it('centres on the slide', () => {
    const r = snap({ x: 588, y: 100, width: 100, height: 30 }, []);
    expect(r.dx).toBe(2);
    expect(r.guides).toContainEqual({ axis: 'x', at: 640 });
  });

  it('leaves a block alone when nothing is close', () => {
    expect(snap({ x: 300, y: 300, width: 51, height: 51 }, [{ x: 10, y: 10, width: 20, height: 20 }])).toEqual({ dx: 0, dy: 0, guides: [] });
  });

  it('snaps both axes independently', () => {
    const r = snap({ x: 12, y: 704, width: 10, height: 20 }, []);
    expect([r.dx, r.dy]).toEqual([0, -4]);
  });
});
