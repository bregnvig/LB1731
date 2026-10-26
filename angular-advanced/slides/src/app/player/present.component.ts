import { Component, ElementRef, OnDestroy, ViewEncapsulation, afterNextRender, inject, viewChild } from '@angular/core';
import Reveal, { type RevealApi } from 'reveal.js';
import RevealNotes from 'reveal.js/plugin/notes';
import { DeckService } from '../deck/deck.service';
import { createBlockAnimations } from './block-animations';
import { deckHtml } from './deck-html';
import { highlightCode, scrollToHighlights } from './highlight';
import { inlineSvgImages } from './inline-svg';
import { connectSync } from '../sync/sync';

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
} as const;

/**
 * The presentation. Query params: `test` (no transitions, hidden slides shown, no controls),
 * `embed=current|next` (inside the presenter view), `print-pdf` (read by reveal.js itself).
 */
@Component({
  selector: 'app-present',
  template: `<div class="reveal" #reveal><div class="slides"></div></div>`,
  styles: `app-present { position: absolute; inset: 0; }`,
  encapsulation: ViewEncapsulation.None,
})
export class PresentComponent implements OnDestroy {
  private readonly deckService = inject(DeckService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('reveal');
  private reveal?: RevealApi;
  private disconnect?: () => void;
  readonly animations = createBlockAnimations();

  constructor() {
    afterNextRender(() => this.start());
  }

  private async start() {
    const deck = await this.deckService.load();
    const el = this.root().nativeElement;
    el.querySelector('.slides')!.innerHTML = deckHtml(deck);
    highlightCode(el);
    await inlineSvgImages(el);
    const params = new URLSearchParams(location.search);
    const embedded = params.has('embed');
    this.reveal = new Reveal(el, {
      ...REVEAL_CONFIG,
      ...(params.has('test') ? { transition: 'none', backgroundTransition: 'none', showHiddenSlides: true, controls: false, progress: false, hash: false } : {}),
      ...(embedded ? { controls: false, progress: false, hash: false } : {}),
      plugins: [RevealNotes, this.animations],
    });
    // Code blocks scroll to their highlighted lines once their slide is on screen.
    const scrollCode = () => (this.reveal?.getCurrentSlide() as HTMLElement | undefined)
      ?.querySelectorAll<HTMLElement>('.block[data-type="code"] pre > code[data-line-numbers]').forEach(scrollToHighlights);
    this.reveal.on('ready', scrollCode);
    this.reveal.on('slidechanged', scrollCode);
    await this.reveal.initialize();
    (window as any).Reveal = this.reveal;
    // The next-slide view in the presenter follows one step ahead; printing needs no sync.
    if (!params.has('print-pdf')) this.disconnect = connectSync(this.reveal, this.animations, params.get('embed') === 'next' ? { follower: 'next' } : {});
  }

  ngOnDestroy() {
    this.disconnect?.();
    this.reveal?.destroy();
  }
}
