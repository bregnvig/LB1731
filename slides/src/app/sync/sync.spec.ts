import { describe, expect, it, vi } from 'vitest';
import type { BlockAnimationsPlugin } from '../player/block-animations';
import { Bus, connectSync } from './sync';

// A shared in-memory channel: every bus sees every other bus's messages, like BroadcastChannel.
// `queued` holds messages until flush(), like real windows that each take a while to answer.
function channel(queued = false) {
  const buses: { fn?: (e: { data: unknown }) => void }[] = [];
  const sent: unknown[] = [];
  const queue: (() => void)[] = [];
  const bus = (): Bus => {
    const me: { fn?: (e: { data: unknown }) => void } = {};
    buses.push(me);
    const deliver = (data: unknown) => buses.filter(b => b !== me).forEach(b => b.fn?.({ data }));
    return {
      postMessage: data => { sent.push(data); if (queued) queue.push(() => deliver(data)); else deliver(data); },
      addEventListener: (_: 'message', fn) => { me.fn = fn; },
      close: () => buses.splice(buses.indexOf(me), 1),
    };
  };
  const flush = () => { while (queue.length) queue.shift()!(); };
  return { bus, sent, flush };
}

function fakeReveal() {
  const handlers: Record<string, ((e: unknown) => void)[]> = {};
  let idx = { h: 0, v: 0, f: undefined as number | undefined };
  const emit = (name: string) => handlers[name]?.forEach(fn => fn({}));
  return {
    on: (name: string, fn: (e: unknown) => void) => (handlers[name] ??= []).push(fn),
    off: () => {},
    getIndices: () => ({ ...idx }),
    slide: vi.fn((h: number, v = 0, f?: number) => { idx = { h, v, f }; emit('slidechanged'); }),
    next: vi.fn(() => { idx = { ...idx, h: idx.h + 1 }; emit('slidechanged'); }),
  };
}

function fakeAnimations() {
  let clicks: string[] = [];
  let listener: (name: string) => void = () => {};
  return {
    clicked: () => [...clicks],
    restore: vi.fn((names: string[]) => { clicks = [...new Set([...clicks, ...names])]; }),
    onTrigger: (fn: (name: string) => void) => { listener = fn; },
    click(name: string) { clicks.push(name); listener(name); },
  };
}

const anims = (a: ReturnType<typeof fakeAnimations>) => a as unknown as BlockAnimationsPlugin;

describe('connectSync', () => {
  it('moves the other window and does not echo', () => {
    const ch = channel();
    const a = fakeReveal(), b = fakeReveal();
    connectSync(a as any, anims(fakeAnimations()), { bus: ch.bus() });
    connectSync(b as any, anims(fakeAnimations()), { bus: ch.bus() });
    ch.sent.length = 0;
    a.slide(3, 1, 0);
    expect(b.getIndices()).toEqual({ h: 3, v: 1, f: 0 });
    expect(ch.sent.length).toBeLessThanOrEqual(2);
  });

  it('gives a late window the current state after hello', () => {
    vi.useFakeTimers();
    const ch = channel();
    const a = fakeReveal();
    connectSync(a as any, anims(fakeAnimations()), { bus: ch.bus() });
    a.slide(2, 0);
    vi.advanceTimersByTime(1000);
    const c = fakeReveal();
    connectSync(c as any, anims(fakeAnimations()), { bus: ch.bus() });
    vi.useRealTimers();
    expect(c.getIndices()).toEqual({ h: 2, v: 0, f: undefined });
  });

  it('replays clicks in the other window', () => {
    const ch = channel();
    const a = fakeReveal(), b = fakeReveal();
    const aa = fakeAnimations(), ba = fakeAnimations();
    connectSync(a as any, anims(aa), { bus: ch.bus() });
    connectSync(b as any, anims(ba), { bus: ch.bus() });
    ch.sent.length = 0;
    aa.click('box');
    expect(ba.restore).toHaveBeenCalledWith(['box']);
    expect(ch.sent.length).toBe(1);
  });

  it('a follower shows the step after the state and never posts', () => {
    const ch = channel();
    const a = fakeReveal(), f = fakeReveal();
    connectSync(a as any, anims(fakeAnimations()), { bus: ch.bus() });
    const fBus = ch.bus();
    const post = vi.spyOn(fBus, 'postMessage');
    connectSync(f as any, anims(fakeAnimations()), { bus: fBus, follower: 'next' });
    f.next.mockClear();
    post.mockClear();
    a.slide(4, 0);
    expect(f.slide).toHaveBeenLastCalledWith(4, 0, undefined);
    expect(f.next).toHaveBeenCalledTimes(1);
    expect(f.getIndices().h).toBe(5);
    expect(post).not.toHaveBeenCalled();
  });

  it('a window that just opened does not answer hello with its own start position', () => {
    vi.useFakeTimers();
    const ch = channel(true);
    const a = fakeReveal();
    connectSync(a as any, anims(fakeAnimations()), { bus: ch.bus() });
    a.slide(2, 1);
    ch.flush();
    // Two windows open together: neither knows the state yet when the other says hello.
    vi.advanceTimersByTime(1000);
    const b = fakeReveal(), c = fakeReveal();
    connectSync(b as any, anims(fakeAnimations()), { bus: ch.bus() });
    vi.advanceTimersByTime(10);
    connectSync(c as any, anims(fakeAnimations()), { bus: ch.bus() });
    ch.flush();
    vi.useRealTimers();
    expect([a, b, c].map(r => r.getIndices())).toEqual(Array(3).fill({ h: 2, v: 1, f: undefined }));
  });

  it('a follower takes the controller\'s answer even when it counts as older', () => {
    // Same millisecond: the tie-breaking fraction makes the follower look older than the controller.
    vi.useFakeTimers();
    // Each window draws its id, then its tie-breaking fraction.
    const random = vi.spyOn(Math, 'random').mockReturnValueOnce(0.3).mockReturnValueOnce(0.9).mockReturnValueOnce(0.6).mockReturnValueOnce(0.1);
    const ch = channel();
    const a = fakeReveal();
    a.slide(3, 0);
    connectSync(a as any, anims(fakeAnimations()), { bus: ch.bus() });
    const f = fakeReveal();
    connectSync(f as any, anims(fakeAnimations()), { bus: ch.bus(), follower: 'next' });
    random.mockRestore();
    vi.useRealTimers();
    expect(f.getIndices()).toEqual({ h: 4, v: 0, f: undefined });
  });

  it('a follower opened before any controller hears from the first one to open', () => {
    vi.useFakeTimers();
    const ch = channel();
    const f = fakeReveal();
    connectSync(f as any, anims(fakeAnimations()), { bus: ch.bus(), follower: 'next' });
    vi.advanceTimersByTime(10);
    const a = fakeReveal();
    a.slide(3, 0);
    connectSync(a as any, anims(fakeAnimations()), { bus: ch.bus() });
    vi.useRealTimers();
    expect(f.getIndices()).toEqual({ h: 4, v: 0, f: undefined });
  });

  it('stops listening when disconnected', () => {
    const ch = channel();
    const a = fakeReveal(), b = fakeReveal();
    connectSync(a as any, anims(fakeAnimations()), { bus: ch.bus() });
    const stop = connectSync(b as any, anims(fakeAnimations()), { bus: ch.bus() });
    stop();
    a.slide(5, 0);
    expect(b.getIndices().h).toBe(0);
  });
});
