import { Component, ElementRef, OnDestroy, ViewEncapsulation, afterNextRender, inject, viewChild } from '@angular/core';
import Reveal, { type RevealApi } from 'reveal.js';
import RevealHighlight from 'reveal.js/plugin/highlight';
import RevealNotes from 'reveal.js/plugin/notes';
import { DeckService } from '../deck/deck.service';
import { createBlockAnimations } from './block-animations';
import { deckHtml } from './deck-html';

export const REVEAL_CONFIG = {
  width: 1280,
  height: 720,
  margin: 0.05,
  hash: true,
  controls: true,
  progress: true,
  mouseWheel: false,
  slideNumber: 'h.v',
  fragmentInURL: true,
  center: false,
  transition: 'slide',
  backgroundTransition: 'slide',
  highlight: { escapeHTML: false },
} as const;

/**
 * The presentation. Query params: `test` (no transitions, hidden slides shown, no controls),
 * `embed=current|next` (inside the presenter view), `print-pdf` (read by reveal.js itself).
 */
@Component({
  selector: 'app-present',
  template: `<div class="reveal" #reveal><div class="slides"></div></div>`,
  styles: `app-present { position: fixed; inset: 0; }`,
  encapsulation: ViewEncapsulation.None,
})
export class PresentComponent implements OnDestroy {
  private readonly deckService = inject(DeckService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('reveal');
  private reveal?: RevealApi;
  readonly animations = createBlockAnimations();

  constructor() {
    afterNextRender(() => this.start());
  }

  private async start() {
    const deck = await this.deckService.load();
    const el = this.root().nativeElement;
    el.querySelector('.slides')!.innerHTML = deckHtml(deck);
    const params = new URLSearchParams(location.search);
    const embedded = params.has('embed');
    this.reveal = new Reveal(el, {
      ...REVEAL_CONFIG,
      ...(params.has('test') ? { transition: 'none', backgroundTransition: 'none', showHiddenSlides: true, controls: false, progress: false, hash: false } : {}),
      ...(embedded ? { controls: false, progress: false, hash: false } : {}),
      plugins: [RevealNotes, RevealHighlight, this.animations],
    });
    await this.reveal.initialize();
    (window as any).Reveal = this.reveal;
  }

  ngOnDestroy() {
    this.reveal?.destroy();
  }
}
