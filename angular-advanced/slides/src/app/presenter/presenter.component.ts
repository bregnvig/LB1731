import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import type { RevealApi } from 'reveal.js';

const two = (n: number) => String(n).padStart(2, '0');
const KEYS: Record<string, 'next' | 'prev' | 'up' | 'down' | 'left' | 'right'> = {
  ArrowRight: 'right', ArrowLeft: 'left', ArrowUp: 'up', ArrowDown: 'down',
  ' ': 'next', PageDown: 'next', n: 'next', PageUp: 'prev', p: 'prev',
};

/** Speaker view: the current slide (drives the other windows), the next step, notes and timers. */
@Component({
  selector: 'app-presenter',
  host: { '(window:keydown)': 'key($event)' },
  template: `
    <header>
      <span class="clock">{{ clock() }}</span>
      <span class="elapsed">{{ elapsed() }}</span>
      <button type="button" (click)="resetTimer()">Reset timer</button>
      <span class="number">{{ number() }}</span>
    </header>
    <iframe #current class="current" src="/present?embed=current" title="Current slide" (load)="attach()"></iframe>
    <section class="side">
      <h2>Next</h2>
      <iframe class="next" src="/present?embed=next" title="Next step" tabindex="-1"></iframe>
      <h2>Notes</h2>
      <div class="notes" data-testid="notes">{{ notes() }}</div>
    </section>
  `,
  styles: `
    :host {
      position: absolute; inset: 0; display: grid; gap: 12px; padding: 12px; box-sizing: border-box;
      grid-template: auto 1fr / 3fr 2fr; background: #16181d; color: #e8e6e1;
      font: 15px/1.4 system-ui, sans-serif;
    }
    header { grid-column: 1 / -1; display: flex; align-items: center; gap: 16px; }
    .clock, .elapsed { font: 600 22px ui-monospace, monospace; }
    .elapsed { color: #8fd0a6; }
    .number { margin-left: auto; opacity: .7; }
    button { background: #2a2e37; color: inherit; border: 1px solid #3a3f4b; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
    button:hover { background: #343945; }
    iframe { border: 0; width: 100%; aspect-ratio: 16 / 9; background: #222; }
    .current { align-self: start; }
    .side { display: flex; flex-direction: column; gap: 6px; min-height: 0; }
    h2 { margin: 6px 0 0; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; opacity: .6; }
    .notes { flex: 1; overflow: auto; white-space: pre-wrap; font-size: 20px; line-height: 1.45; }
  `,
})
export class PresenterComponent {
  private readonly current = viewChild.required<ElementRef<HTMLIFrameElement>>('current');
  readonly notes = signal('');
  readonly number = signal('');
  readonly clock = signal('');
  readonly elapsed = signal('00:00:00');
  private started: number | null = null;

  constructor() {
    const tick = () => {
      const now = new Date();
      this.clock.set(`${two(now.getHours())}:${two(now.getMinutes())}`);
      const s = this.started == null ? 0 : Math.floor((Date.now() - this.started) / 1000);
      this.elapsed.set(`${two(Math.floor(s / 3600))}:${two(Math.floor(s / 60) % 60)}:${two(s % 60)}`);
    };
    tick();
    const timer = setInterval(tick, 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  private reveal(): RevealApi | undefined {
    const r = (this.current().nativeElement.contentWindow as any)?.Reveal as RevealApi | undefined;
    return r?.isReady() ? r : undefined;
  }

  /** Waits for the current slide's player, then follows its slide changes. */
  attach() {
    const r = this.reveal();
    if (!r) { setTimeout(() => this.attach(), 100); return; }
    const show = () => {
      const slide = r.getCurrentSlide() as HTMLElement;
      this.notes.set(slide.querySelector('aside.notes')?.textContent ?? '');
      const { h, v } = r.getIndices();
      this.number.set(`${h + 1}.${(v ?? 0) + 1}`);
    };
    r.on('slidechanged', () => {
      this.started ??= Date.now();
      show();
    });
    show();
  }

  resetTimer() {
    this.started = Date.now();
    this.elapsed.set('00:00:00');
  }

  key(e: KeyboardEvent) {
    const action = KEYS[e.key];
    const r = this.reveal();
    if (!action || !r || (e.target as HTMLElement).tagName === 'BUTTON') return;
    e.preventDefault();
    r[action]();
  }
}
