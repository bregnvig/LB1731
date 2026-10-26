import { Component, DestroyRef, ElementRef, afterRenderEffect, inject, input, signal, viewChild } from '@angular/core';
import { Slide } from '../deck/model';
import { highlightCode } from '../player/highlight';
import { inlineSvgImages } from '../player/inline-svg';
import { renderSlide } from '../player/render';

/**
 * Draws a slide the way the presentation does, every block in its end state: inside a 1280×720
 * reveal frame, scaled to `scale`. Used by the canvas and the slide thumbnails.
 */
export function paintSlide(host: HTMLElement, slide: Slide, opts: { highlight: boolean }) {
  host.innerHTML = `<div class="reveal"><div class="slides">${renderSlide(slide).replace('<section', '<section class="present"')}</div></div>`;
  if (opts.highlight) highlightCode(host);
  void inlineSvgImages(host);
}

@Component({
  selector: 'app-canvas',
  template: `<div class="frame" #frame [style.width.px]="1280 * scale()" [style.height.px]="720 * scale()">
    <div class="editor-slide" #paint [style.transform]="'scale(' + scale() + ')'"></div>
  </div>`,
  styles: `
    :host { display: flex; align-items: center; justify-content: center; min-width: 0; min-height: 0; }
    .frame { position: relative; box-shadow: 0 1px 3px rgba(0,0,0,.2), 0 12px 40px rgba(0,0,0,.12); background: #222; }
  `,
})
export class CanvasComponent {
  readonly slide = input.required<Slide>();
  readonly scale = signal(0.6);
  private readonly paint = viewChild.required<ElementRef<HTMLElement>>('paint');

  constructor() {
    afterRenderEffect(() => paintSlide(this.paint().nativeElement, this.slide(), { highlight: true }));
    // Fit the slide into the space the editor gives the canvas.
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const fit = new ResizeObserver(([e]) =>
      this.scale.set(Math.max(0.2, Math.min((e.contentRect.width - 48) / 1280, (e.contentRect.height - 48) / 720))));
    fit.observe(host);
    inject(DestroyRef).onDestroy(() => fit.disconnect());
  }
}
