import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBlockAnimations } from './block-animations';

const frames = () => new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

function fakeReveal(slide: HTMLElement) {
  const handlers: Record<string, ((e: any) => void)[]> = {};
  let current = slide;
  return {
    getCurrentSlide: () => current,
    getRevealElement: () => document.body,
    on: (event: string, fn: (e: any) => void) => (handlers[event] ??= []).push(fn),
    emit(event: string, e: any = {}) { handlers[event]?.forEach(fn => fn(e)); },
    go(next: HTMLElement) { const previousSlide = current; current = next; this.emit('slidechanged', { previousSlide, currentSlide: next }); },
  };
}

const slideHtml = `
  <div class="block" data-name="code-2"></div>
  <div class="block" data-name="intro" data-animate="fade-in" data-animate-duration="0.4" data-animate-delay="0.2"></div>
  <div class="block" data-name="answer" data-animate="scale-down" data-animate-duration="0.6" data-animate-delay="0" data-animate-on="code-2"></div>`;

describe('block animations', () => {
  let slide: HTMLElement, other: HTMLElement;
  const el = (name: string) => slide.querySelector<HTMLElement>(`[data-name="${name}"]`)!;

  beforeEach(() => {
    document.body.innerHTML = `<section id="a">${slideHtml}</section><section id="b"></section>`;
    slide = document.getElementById('a')!;
    other = document.getElementById('b')!;
  });
  afterEach(() => vi.restoreAllMocks());

  it('plays entry animations from their start state with the block timing', async () => {
    const reveal = fakeReveal(slide);
    createBlockAnimations().init(reveal as any);
    reveal.emit('ready');
    expect(el('intro').classList.contains('animate-start')).toBe(true);
    expect(el('intro').style.transitionDuration).toBe('0.4s');
    expect(el('intro').style.transitionDelay).toBe('0.2s');
    await frames();
    expect(el('intro').classList.contains('animate-in')).toBe(true);
  });

  it('holds click-triggered blocks until their target is clicked', async () => {
    const reveal = fakeReveal(slide);
    const anim = createBlockAnimations();
    anim.init(reveal as any);
    reveal.emit('ready');
    await frames();
    expect(el('answer').classList.contains('animate-in')).toBe(false);
    el('code-2').click();
    expect(el('answer').classList.contains('animate-in')).toBe(true);
    expect(anim.clicked()).toEqual(['code-2']);
  });

  it('applies the start state instantly and transitions only to the end state', async () => {
    const reveal = fakeReveal(slide);
    const anim = createBlockAnimations();
    anim.init(reveal as any);
    reveal.emit('ready');
    expect(el('answer').style.transitionProperty).toBe('none');
    await frames();
    anim.trigger('code-2');
    expect(el('answer').style.transitionProperty).not.toBe('none');
    expect(el('answer').style.transitionDuration).toBe('0.6s');
  });

  it('notifies listeners when a trigger fires', () => {
    const reveal = fakeReveal(slide);
    const anim = createBlockAnimations();
    const seen: string[] = [];
    anim.onTrigger(n => seen.push(n));
    anim.init(reveal as any);
    reveal.emit('ready');
    anim.trigger('code-2');
    expect(seen).toEqual(['code-2']);
  });

  it('restores clicks in their end state without replaying the transition', () => {
    const reveal = fakeReveal(slide);
    const anim = createBlockAnimations();
    anim.init(reveal as any);
    reveal.emit('ready');
    anim.restore(['code-2']);
    expect(el('answer').classList.contains('animate-in')).toBe(true);
    expect(el('answer').style.transition).toBe('none');
    expect(anim.clicked()).toEqual(['code-2']);
  });

  it('keeps a slide as it was while it is left, and starts it over when it is shown again', () => {
    const reveal = fakeReveal(slide);
    const anim = createBlockAnimations();
    anim.init(reveal as any);
    reveal.emit('ready');
    reveal.go(other);
    // Still hidden: the slide is on screen during the transition away.
    expect(el('answer').classList.contains('animate-start')).toBe(true);
    reveal.go(slide);
    anim.trigger('code-2');
    reveal.go(other);
    expect(el('answer').classList.contains('animate-in')).toBe(true);
    expect(anim.clicked()).toEqual([]);
    reveal.go(slide);
    expect(el('answer').classList.contains('animate-start')).toBe(true);
    expect(el('answer').classList.contains('animate-in')).toBe(false);
  });

  it('shows a block whose trigger target is missing, with a warning', () => {
    el('code-2').remove();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const reveal = fakeReveal(slide);
    createBlockAnimations().init(reveal as any);
    reveal.emit('ready');
    expect(el('answer').classList.contains('animate-in')).toBe(true);
    expect(warn).toHaveBeenCalledWith('block-animations: no block named "code-2" for "answer"');
  });

  it('finishAll puts every animated block in its end state', () => {
    const anim = createBlockAnimations();
    anim.finishAll();
    for (const name of ['intro', 'answer']) {
      expect(el(name).classList.contains('animate-in')).toBe(true);
      expect(el(name).style.transition).toBe('none');
    }
  });
});
