import type { RevealApi } from 'reveal.js';

// Enter/exit animations on blocks. A block with data-animate starts in its start state
// (.animate-start) and moves to its end state (.animate-in) with a CSS transition, either when
// the slide appears or when the block named in data-animate-on is clicked. Clicking that block
// again plays it back to the start state. The effect's start and end states live in deck.css.

export interface BlockAnimationsPlugin {
  id: 'block-animations';
  init(reveal: RevealApi): void;
  /** Plays (or plays back) the animations toggled by clicking the block called `name` on the current slide. */
  trigger(name: string): void;
  /** Names toggled on for the current slide, in the order they were clicked. */
  clicked(): string[];
  /** Sets every click on the current slide straight to on (named here) or off (used to catch up with another window). */
  restore(names: string[]): void;
  /** Every animated block in the document in its end state (print, editor preview). */
  finishAll(): void;
  onTrigger(fn: (name: string) => void): void;
}

const animated = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('[data-animate]')];

function setState(el: HTMLElement, end: boolean, instant: boolean) {
  el.style.transitionProperty = instant ? 'none' : '';
  const [from, to] = end ? ['animate-start', 'animate-in'] : ['animate-in', 'animate-start'];
  el.classList.replace(from, to) || el.classList.add(to);
}
const endState = (el: HTMLElement, instant: boolean) => setState(el, true, instant);

export function createBlockAnimations(): BlockAnimationsPlugin {
  let reveal: RevealApi | undefined;
  let clicks: string[] = [];
  const listeners: ((name: string) => void)[] = [];

  // A slide being left keeps its state until it is shown again: it is still on screen while the
  // transition runs, and clearing it there would flash its hidden blocks in.
  function enter(slide: HTMLElement | undefined) {
    clicks = [];
    if (!slide) return;
    const names = new Set([...slide.querySelectorAll<HTMLElement>('[data-name]')].map(el => el.dataset['name']));
    const entry: HTMLElement[] = [];
    for (const el of animated(slide)) {
      el.style.transitionDuration = `${el.dataset['animateDuration'] ?? 0.6}s`;
      el.style.transitionDelay = `${el.dataset['animateDelay'] ?? 0}s`;
      el.classList.remove('animate-in');
      // The start state applies instantly; only the move to the end state is animated.
      el.style.transitionProperty = 'none';
      el.classList.add('animate-start');
      const on = el.dataset['animateOn'];
      if (!on) entry.push(el);
      else if (!names.has(on)) {
        console.warn(`block-animations: no block named "${on}" for "${el.dataset['name']}"`);
        endState(el, true);
      }
    }
    // Two frames so the start state is painted before the transition to the end state begins.
    requestAnimationFrame(() => requestAnimationFrame(() => entry.forEach(el => endState(el, false))));
  }

  function play(name: string, on: boolean, instant: boolean) {
    const slide = reveal?.getCurrentSlide() as HTMLElement | undefined;
    if (!slide) return;
    for (const el of slide.querySelectorAll<HTMLElement>(`[data-animate-on="${CSS.escape(name)}"]`)) setState(el, on, instant);
    clicks = clicks.filter(n => n !== name);
    if (on) clicks.push(name);
  }

  return {
    id: 'block-animations',
    init(r) {
      reveal = r;
      r.on('ready', () => enter(r.getCurrentSlide() as HTMLElement));
      r.on('slidechanged', (e: any) => enter(e.currentSlide));
      r.getRevealElement()?.addEventListener('click', e => {
        const block = (e.target as HTMLElement).closest<HTMLElement>('[data-name]');
        const name = block?.dataset['name'];
        const slide = r.getCurrentSlide() as HTMLElement;
        if (name && slide?.contains(block) && slide.querySelector(`[data-animate-on="${CSS.escape(name)}"]`)) this.trigger(name);
      });
    },
    trigger(name) {
      play(name, !clicks.includes(name), false);
      listeners.forEach(fn => fn(name));
    },
    clicked: () => [...clicks],
    restore(names) {
      const slide = reveal?.getCurrentSlide() as HTMLElement | undefined;
      const all = new Set([...slide?.querySelectorAll<HTMLElement>('[data-animate-on]') ?? []].map(el => el.dataset['animateOn']!));
      all.forEach(name => play(name, false, true));
      names.forEach(name => play(name, true, true));
    },
    finishAll() {
      animated(document).forEach(el => endState(el, true));
    },
    onTrigger(fn) {
      listeners.push(fn);
    },
  };
}
