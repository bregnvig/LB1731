export interface Rect { x: number; y: number; width: number; height: number }
export interface Guide { axis: 'x' | 'y'; at: number }

const lines = (start: number, size: number) => [start, start + size / 2, start + size];

/**
 * How far to shift a block being dragged so one of its edges or its centre lines up with an edge
 * or centre of another block or of the slide, per axis, within `tolerance` px. Returns the guide
 * lines to draw.
 */
export function snap(moving: Rect, others: Rect[], slide = { width: 1280, height: 720 }, tolerance = 5): { dx: number; dy: number; guides: Guide[] } {
  const axis = (a: 'x' | 'y') => {
    const [pos, size] = a === 'x' ? (['x', 'width'] as const) : (['y', 'height'] as const);
    const targets = [...lines(0, slide[size]), ...others.flatMap(o => lines(o[pos], o[size]))];
    const own = lines(moving[pos], moving[size]);
    let best: number | null = null;
    for (const t of targets) for (const f of own) if (Math.abs(t - f) <= tolerance && (best == null || Math.abs(t - f) < Math.abs(best))) best = t - f;
    if (best == null) return { d: 0, guides: [] };
    const shifted = own.map(f => f + best!);
    const at = [...new Set(targets.filter(t => shifted.some(f => Math.abs(f - t) < 0.01)))];
    return { d: best, guides: at.map(at => ({ axis: a, at })) };
  };
  const x = axis('x'), y = axis('y');
  return { dx: x.d, dy: y.d, guides: [...x.guides, ...y.guides] };
}
