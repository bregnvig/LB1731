import { Component, computed, inject, input } from '@angular/core';
import { Block, DrawingBlock, ImageBlock, TableBlock } from '../../deck/model';
import { EditorStore } from '../editor.store';
import { TableEdit, editTable } from '../media';
import { ColorFieldComponent } from './color-field.component';
import { getDecl, setDecl } from './type-settings.component';

const num = (e: Event) => Number((e.target as HTMLInputElement).value);

/** Reads and rewrites the color (and, for pen strokes, the width) of a drawing's paths. */
function drawingStyle(svg: string) {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const path = doc.querySelector('path');
  const stroked = !!path?.getAttribute('stroke');
  return {
    stroked,
    color: (stroked ? path?.getAttribute('stroke') : path?.getAttribute('fill')) ?? '#ff0000',
    width: Number(path?.getAttribute('stroke-width') ?? 0),
    with(change: { color?: string; width?: number }) {
      for (const p of doc.querySelectorAll('path')) {
        if (change.color) p.setAttribute(stroked ? 'stroke' : 'fill', change.color);
        if (change.width && stroked) p.setAttribute('stroke-width', String(change.width));
      }
      return new XMLSerializer().serializeToString(doc.documentElement);
    },
  };
}

/** Settings for images, tables and pen drawings. */
@Component({
  selector: 'app-media-settings',
  imports: [ColorFieldComponent],
  template: `
    @switch (block().type) {
      @case ('image') {
        <div class="group">
          <span class="label">Image</span>
          <div class="row"><span class="mono">{{ image().src }}</span>
            <button type="button" class="btn" (click)="picker.click()">Replace…</button></div>
          <input #picker type="file" accept=".png,.jpg,.jpeg,.gif,.svg" hidden (change)="replace(picker)">
          <label class="row"><span>Alt text</span>
            <input class="field" aria-label="Alt text" [value]="image().alt" (change)="set({ alt: $any($event.target).value })"></label>
          <label class="row"><span>Keep aspect ratio</span>
            <input type="checkbox" class="sw" [checked]="image().keepRatio" (change)="set({ keepRatio: $any($event.target).checked })"></label>
          @if (isSvg()) {
            <label class="row"><span>Inline SVG (recolor)</span>
              <input type="checkbox" class="sw" [checked]="image().inlineSvg" (change)="set({ inlineSvg: $any($event.target).checked })"></label>
            @if (image().inlineSvg) {
              <div class="row"><span>SVG color</span>
                <app-color-field label="SVG color" [value]="image().svgColor ?? '#ffffff'" (valueChange)="set({ svgColor: $event || null }, 'svg-color')" /></div>
            }
          }
        </div>
        <div class="group">
          <span class="label">Crop</span>
          <p class="hint">Where the image sits inside the block's frame; the frame clips it.</p>
          <div class="num4">
            <label><b>X</b><input type="number" aria-label="Image X" [value]="crop().x" (change)="setCrop('left', num($event))"></label>
            <label><b>Y</b><input type="number" aria-label="Image Y" [value]="crop().y" (change)="setCrop('top', num($event))"></label>
            <label><b>W</b><input type="number" aria-label="Image width" [value]="crop().width" (change)="setCrop('width', num($event))"></label>
            <label><b>H</b><input type="number" aria-label="Image height" [value]="crop().height" (change)="setCrop('height', num($event))"></label>
          </div>
          <button type="button" class="btn wide" style="margin-top: 8px" [disabled]="!image().imgStyle" (click)="set({ imgStyle: '' })">Reset crop</button>
        </div>
      }
      @case ('table') {
        <div class="group">
          <span class="label">Table</span>
          <div class="iconrow">
            <button type="button" (click)="table('add-row')">+ Row</button>
            <button type="button" (click)="table('remove-row')">− Row</button>
            <button type="button" (click)="table('add-column')">+ Column</button>
            <button type="button" (click)="table('remove-column')">− Column</button>
          </div>
          <p class="hint">Double-click the table on the canvas to edit the cells.</p>
        </div>
      }
      @case ('drawing') {
        <div class="group">
          <span class="label">Drawing</span>
          <div class="row"><span>Color</span>
            <app-color-field label="Drawing color" [value]="drawing().color" (valueChange)="setDrawing({ color: $event })" /></div>
          @if (drawing().stroked) {
            <label class="row"><span>Stroke width</span>
              <input type="number" class="field narrow" min="1" aria-label="Stroke width" [value]="drawing().width" (change)="setDrawing({ width: num($event) })"></label>
          }
          <p class="hint">Draw with the Pen tool above the slide; Escape stops drawing.</p>
        </div>
      }
    }
  `,
})
export class MediaSettingsComponent {
  readonly store = inject(EditorStore);
  readonly block = input.required<Block>();
  readonly num = num;

  readonly image = () => this.block() as ImageBlock;
  readonly isSvg = () => this.image().src.toLowerCase().endsWith('.svg');
  readonly drawing = computed(() => drawingStyle((this.block() as DrawingBlock).svg ?? ''));
  readonly crop = computed(() => {
    const b = this.block() as ImageBlock, px = (p: string) => parseFloat(getDecl(b.imgStyle, p) ?? '');
    return { x: px('left') || 0, y: px('top') || 0, width: px('width') || b.width, height: px('height') || (b.height === 'auto' ? 0 : b.height) };
  });

  set(patch: Record<string, unknown>, coalesce?: string) {
    this.store.updateBlocks([this.block().name], b => ({ ...b, ...patch }) as Block, coalesce && `${coalesce}:${this.block().name}`);
  }

  /** The img gets all four values once any is set, so it's positioned and sized inside the frame. */
  setCrop(prop: 'left' | 'top' | 'width' | 'height', value: number) {
    const c = { ...this.crop(), [{ left: 'x', top: 'y', width: 'width', height: 'height' }[prop]]: value };
    let style = this.image().imgStyle;
    for (const [p, v] of [['left', c.x], ['top', c.y], ['width', c.width], ['height', c.height]] as const) style = setDecl(style, p, `${v}px`);
    this.set({ imgStyle: style });
  }

  async replace(picker: HTMLInputElement) {
    const file = picker.files?.[0];
    picker.value = '';
    const src = file && (await this.store.storeImage(file));
    if (src) this.set({ src, inlineSvg: this.image().inlineSvg && src.endsWith('.svg') });
  }

  table(op: TableEdit) {
    this.set({ html: editTable((this.block() as TableBlock).html, op) });
  }

  setDrawing(change: { color?: string; width?: number }) {
    this.set({ svg: this.drawing().with(change) }, change.color ? 'drawing-color' : undefined);
  }
}
