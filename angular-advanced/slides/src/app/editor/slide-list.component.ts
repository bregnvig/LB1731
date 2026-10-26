import { Component, Directive, ElementRef, afterRenderEffect, inject, input, signal } from '@angular/core';
import { Slide } from '../deck/model';
import { paintSlide } from './canvas.component';
import { EditorStore } from './editor.store';

/** A small, unhighlighted rendering of a slide. */
@Directive({ selector: '[appThumb]' })
export class ThumbDirective {
  readonly appThumb = input.required<Slide>();
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  constructor() {
    afterRenderEffect(() => paintSlide(this.el, this.appThumb(), { highlight: false }));
  }
}

/** The slides of the open course: pick, reorder by dragging, add after the current one. */
@Component({
  selector: 'app-slide-list',
  imports: [ThumbDirective],
  host: { '[class.grid]': 'grid()' },
  template: `
    @for (s of store.slides(); track s.path; let i = $index) {
      <div class="item" [class.current]="i === store.slideIndex()" [class.hidden]="s.hidden" [class.over]="i === over()"
        draggable="true" (dragstart)="dragFrom = i" (dragover)="$event.preventDefault(); over.set(i)" (dragleave)="over.set(-1)"
        (drop)="drop(i)" (click)="store.openSlide(i)" [attr.data-slide]="s.path">
        <span class="n">{{ number(i) }}</span>
        <div class="thumb"><div class="paint editor-slide" [appThumb]="s"></div></div>
      </div>
      @if (i === store.slideIndex() && !grid()) {
        <button type="button" class="add" (click)="store.addSlide()">+ Add slide</button>
      }
    }
  `,
  styles: `
    :host { display: block; }
    .item { display: grid; grid-template-columns: 28px 1fr; align-items: center; gap: 6px; margin-bottom: 8px; cursor: pointer; }
    .n { font-size: 11px; color: var(--muted); text-align: right; }
    .thumb { width: calc(1280px * var(--thumb-scale, .14)); aspect-ratio: 16 / 9; border-radius: 3px; border: 2px solid transparent; overflow: hidden; position: relative; background: #222; }
    .paint { transform: scale(var(--thumb-scale, .14)); }
    .current .thumb { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
    .over .thumb { border-color: var(--guide); }
    .hidden .thumb { opacity: .45; }
    .hidden .thumb::after { content: 'hidden'; position: absolute; right: 4px; bottom: 3px; font-size: 10px; background: #fff; color: var(--ink); padding: 0 4px; border-radius: 3px; }
    .add { display: block; width: calc(100% - 34px); margin: -2px 0 10px 34px; border: 1px dashed #c9c4b9; background: none; border-radius: var(--radius);
      padding: 3px 0; color: var(--muted); cursor: pointer; font-size: 12px; }
    .add:hover { border-color: var(--accent); color: var(--accent); }
    :host(.grid) { --thumb-scale: .164; display: grid; grid-template-columns: repeat(auto-fill, 246px); gap: 14px; align-content: start; justify-content: center; }
  `,
})
export class SlideListComponent {
  readonly store = inject(EditorStore);
  readonly grid = input(false);
  readonly over = signal(-1);
  dragFrom = -1;

  number(i: number) {
    const at = this.store.revealIndices(i);
    return at ? `${at.h + 1}.${at.v + 1}` : '–';
  }

  drop(to: number) {
    this.over.set(-1);
    if (this.dragFrom >= 0 && this.dragFrom !== to) void this.store.moveSlide(this.dragFrom, to);
    this.dragFrom = -1;
  }
}
