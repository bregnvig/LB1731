import { Component, DestroyRef, ElementRef, afterRenderEffect, computed, inject, input, signal, viewChild } from '@angular/core';
import { LineBlock, Slide } from '../deck/model';
import { highlightCode } from '../player/highlight';
import { inlineSvgImages } from '../player/inline-svg';
import { renderBlock, renderSlide, slideFolder } from '../player/render';
import { EditorStore } from './editor.store';
import { Guide, Rect, snap } from './guides';
import { Point, pointsToPath } from './media';

const PEN = { color: '#ff0000', width: 6 };

/**
 * Draws a slide the way the presentation does, every block in its end state: inside a 1280×720
 * reveal frame, scaled by the caller. Used by the canvas and the slide thumbnails.
 */
export function paintSlide(host: HTMLElement, slide: Slide, opts: { highlight: boolean }) {
  host.innerHTML = `<div class="reveal"><div class="slides">${renderSlide(slide).replace('<section', '<section class="present"')}</div></div>`;
  if (opts.highlight) highlightCode(host);
  void inlineSvgImages(host);
}

type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
type Gesture =
  | { kind: 'move'; x0: number; y0: number; names: string[]; moved: boolean; hit: string }
  | { kind: 'resize'; x0: number; y0: number; name: string; handle: Handle; start: Rect }
  | { kind: 'end'; name: string; end: 1 | 2 }
  | { kind: 'marquee'; x0: number; y0: number; additive: boolean }
  | { kind: 'pen'; points: Point[] };

const HANDLES: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
const MIN = 8;
const intersects = (a: Rect, b: Rect) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
const sideways = (h: Handle) => h === 'e' || h === 'w';

/**
 * The slide being edited. The slide is painted as in the presentation; an overlay on top, in slide
 * coordinates, handles the pointer: select, drag with guides (Alt turns them off), resize (Shift
 * keeps the ratio), drag line ends, marquee select. Drags preview on the painted blocks and go to
 * the store once, on release.
 */
@Component({
  selector: 'app-canvas',
  template: `<div class="frame" [style.width.px]="1280 * scale()" [style.height.px]="720 * scale()">
    <div class="editor-slide" #paint [style.transform]="'scale(' + scale() + ')'"></div>
    <div class="overlay" #overlay data-testid="canvas" [class.editing]="editing()" [class.pen]="store.tool() === 'pen'" [style.transform]="'scale(' + scale() + ')'" [style.--inv]="1 / scale()"
      (pointerdown)="down($event)" (pointermove)="move($event)" (pointerup)="up($event)" (pointercancel)="cancel()" (dblclick)="edit($event)">
      @if (editing() && rects().get(editing()!); as r) {
        <div class="fmt" role="toolbar" aria-label="Text formatting" [style.left.px]="r.x" [style.top.px]="r.y" (mousedown)="keepSelection($event)">
          @for (f of blocksFormats; track f.tag) { <button type="button" (click)="format('formatBlock', f.tag)">{{ f.label }}</button> }
          <button type="button" aria-label="Bold" (click)="format('bold')"><b>B</b></button>
          <button type="button" aria-label="Italic" (click)="format('italic')"><i>I</i></button>
          <label class="pick" title="Text color">A<input type="color" aria-label="Selection color" value="#e7ad52" (input)="format('foreColor', $any($event.target).value)"></label>
          <button type="button" (click)="link()">Link</button>
        </div>
      }
      @for (b of selected(); track b.name) {
        <div class="box" [class.locked]="b.locked" [style.left.px]="b.rect.x + offset().x" [style.top.px]="b.rect.y + offset().y"
          [style.width.px]="b.rect.width" [style.height.px]="b.rect.height">
          @if (editing()) {
          } @else if (single() && b.line) {
            <i class="end" data-end="1" [style.left.px]="b.line.x1" [style.top.px]="b.line.y1"></i>
            <i class="end" data-end="2" [style.left.px]="b.line.x2" [style.top.px]="b.line.y2"></i>
          } @else if (single() && !b.locked) {
            @for (h of b.handles; track h) { <i [class]="'h ' + h" [attr.data-handle]="h"></i> }
          }
          @if (single() && !editing()) { <span class="size" data-testid="size">{{ round(b.rect.width) }} × {{ round(b.rect.height) }}</span> }
        </div>
      }
      @for (g of guides(); track $index) {
        <div class="guide" [class.x]="g.axis === 'x'" [style.left.px]="g.axis === 'x' ? g.at : null" [style.top.px]="g.axis === 'y' ? g.at : null"></div>
      }
      @if (stroke()) {
        <svg class="stroke" width="1280" height="720"><path [attr.d]="stroke()" fill="none" [attr.stroke]="pen.color" [attr.stroke-width]="pen.width" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      }
      @if (marquee(); as m) {
        <div class="marquee" [style.left.px]="m.x" [style.top.px]="m.y" [style.width.px]="m.width" [style.height.px]="m.height"></div>
      }
    </div>
  </div>`,
  styles: `
    :host { display: flex; align-items: center; justify-content: center; min-width: 0; min-height: 0; }
    .frame { position: relative; box-shadow: 0 1px 3px rgba(0,0,0,.2), 0 12px 40px rgba(0,0,0,.12); background: #222; }
    .overlay { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; transform-origin: 0 0; touch-action: none; }
    .box { position: absolute; outline: calc(2px * var(--inv)) solid var(--accent); pointer-events: none; }
    .box.locked { outline-style: dashed; }
    .h, .end { position: absolute; width: calc(10px * var(--inv)); height: calc(10px * var(--inv)); margin: calc(-5px * var(--inv)) 0 0 calc(-5px * var(--inv));
      background: #fff; border: calc(2px * var(--inv)) solid var(--accent); box-sizing: border-box; pointer-events: auto; }
    .end { border-radius: 50%; cursor: crosshair; }
    .nw { left: 0; top: 0; cursor: nwse-resize; } .n { left: 50%; top: 0; cursor: ns-resize; } .ne { left: 100%; top: 0; cursor: nesw-resize; }
    .e { left: 100%; top: 50%; cursor: ew-resize; } .se { left: 100%; top: 100%; cursor: nwse-resize; } .s { left: 50%; top: 100%; cursor: ns-resize; }
    .sw { left: 0; top: 100%; cursor: nesw-resize; } .w { left: 0; top: 50%; cursor: ew-resize; }
    .size { position: absolute; left: 0; top: calc(-24px * var(--inv)); background: var(--accent); color: #fff; white-space: nowrap;
      font: 500 calc(11px * var(--inv)) / 1.6 'IBM Plex Mono', monospace; padding: 0 calc(6px * var(--inv)); border-radius: calc(3px * var(--inv)); }
    .guide { position: absolute; left: 0; right: 0; border-top: calc(1px * var(--inv)) dashed var(--guide); pointer-events: none; }
    .guide.x { top: 0; bottom: 0; right: auto; border-top: 0; border-left: calc(1px * var(--inv)) dashed var(--guide); }
    .overlay.editing { pointer-events: none; }
    .overlay.pen { cursor: crosshair; }
    .stroke { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
    .fmt { position: absolute; pointer-events: auto; display: flex; gap: 2px; background: var(--ink); border-radius: calc(6px * var(--inv)); padding: calc(3px * var(--inv));
      transform: translateY(calc(-100% - 8px * var(--inv))); font: calc(12px * var(--inv)) 'IBM Plex Sans', sans-serif; }
    .fmt button, .fmt .pick { border: 0; background: none; color: #fff; padding: calc(3px * var(--inv)) calc(8px * var(--inv)); border-radius: calc(4px * var(--inv)); cursor: pointer; font: inherit; }
    .fmt button:hover, .fmt .pick:hover { background: #3a3833; }
    .fmt .pick { position: relative; color: #e7ad52; font-weight: 600; }
    .fmt .pick input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .marquee { position: absolute; background: rgba(15, 118, 110, .12); border: calc(1px * var(--inv)) solid var(--accent); pointer-events: none; }
  `,
})
export class CanvasComponent {
  readonly store = inject(EditorStore);
  readonly pen = PEN;
  readonly stroke = signal('');
  readonly slide = input.required<Slide>();
  readonly scale = signal(0.6);
  private readonly paint = viewChild.required<ElementRef<HTMLElement>>('paint');
  private readonly overlay = viewChild.required<ElementRef<HTMLElement>>('overlay');

  /** Where each top-level block is drawn, measured after painting (text heights are only known then). */
  readonly rects = signal(new Map<string, Rect>());
  readonly offset = signal({ x: 0, y: 0 });
  readonly guides = signal<Guide[]>([]);
  readonly marquee = signal<Rect | null>(null);
  private gesture: Gesture | null = null;
  /** The text block being typed into, if any. */
  readonly editing = signal<string | null>(null);
  readonly blocksFormats = [{ tag: 'p', label: 'P' }, { tag: 'h1', label: 'H1' }, { tag: 'h2', label: 'H2' }, { tag: 'h3', label: 'H3' }];
  private range: Range | null = null;

  readonly round = Math.round;
  readonly single = computed(() => this.store.selection().length === 1);
  readonly selected = computed(() => {
    const names = new Set(this.store.selection()), rects = this.rects();
    return this.slide().blocks.filter(b => names.has(b.name) && rects.has(b.name)).map(b => ({
      name: b.name, locked: !!b.locked, rect: rects.get(b.name)!,
      line: b.type === 'line' ? b : null,
      handles: b.height === 'auto' ? (['e', 'w'] as Handle[]) : HANDLES,
    }));
  });

  constructor() {
    let painted: { path: string; blocks: Slide['blocks'] } | null = null;
    afterRenderEffect(() => {
      const slide = this.slide();
      // Saving changes the etag and typing notes changes the notes; neither changes the drawing,
      // and repainting would throw away text being edited.
      if (painted?.path === slide.path && painted.blocks === slide.blocks) return;
      painted = { path: slide.path, blocks: slide.blocks };
      this.editing.set(null);
      paintSlide(this.paint().nativeElement, slide, { highlight: true });
      this.rects.set(new Map(this.blockElements().map(el => [el.dataset['name']!, { x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight }])));
    });
    // Fit the slide into the space the editor gives the canvas.
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const fit = new ResizeObserver(([e]) =>
      this.scale.set(Math.max(0.2, Math.min((e.contentRect.width - 48) / 1280, (e.contentRect.height - 48) / 720))));
    fit.observe(host);
    inject(DestroyRef).onDestroy(() => fit.disconnect());
  }

  private blockElements(): HTMLElement[] {
    return [...this.paint().nativeElement.querySelectorAll<HTMLElement>('section > .block')];
  }

  private element(name: string) {
    return this.blockElements().find(el => el.dataset['name'] === name);
  }

  private point(e: PointerEvent) {
    const r = this.overlay().nativeElement.getBoundingClientRect();
    return { x: (e.clientX - r.left) / this.scale(), y: (e.clientY - r.top) / this.scale() };
  }

  /** The top-level block drawn under the pointer, topmost first. */
  private hit(e: PointerEvent): string | null {
    const paint = this.paint().nativeElement;
    const el = document.elementsFromPoint(e.clientX, e.clientY).find(el => paint.contains(el));
    return el?.closest<HTMLElement>('section > .block')?.dataset['name'] ?? null;
  }

  down(e: PointerEvent) {
    const target = e.target as HTMLElement;
    // The format bar's buttons handle their own clicks; capturing the pointer would steal them.
    if (e.button !== 0 || target.closest('.fmt')) return;
    const p = this.point(e);
    this.overlay().nativeElement.setPointerCapture(e.pointerId);
    if (this.store.tool() === 'pen') {
      this.gesture = { kind: 'pen', points: [p] };
      return;
    }
    const name = this.store.selection()[0];
    if (target.dataset['handle']) {
      this.gesture = { kind: 'resize', x0: p.x, y0: p.y, name, handle: target.dataset['handle'] as Handle, start: this.rects().get(name)! };
      return;
    }
    if (target.dataset['end']) {
      this.gesture = { kind: 'end', name, end: Number(target.dataset['end']) as 1 | 2 };
      return;
    }
    const hit = this.hit(e);
    if (!hit) {
      this.gesture = { kind: 'marquee', x0: p.x, y0: p.y, additive: e.shiftKey };
      return;
    }
    if (e.shiftKey || !this.store.selection().includes(hit)) this.store.select([hit], e.shiftKey);
    const locked = new Set(this.slide().blocks.filter(b => b.locked).map(b => b.name));
    this.gesture = { kind: 'move', x0: p.x, y0: p.y, names: this.store.selection().filter(n => !locked.has(n)), moved: false, hit };
  }

  move(e: PointerEvent) {
    const g = this.gesture;
    if (!g) return;
    const p = this.point(e);
    if (g.kind === 'pen') {
      g.points.push(p);
      this.stroke.set(pointsToPath(g.points));
    } else if (g.kind === 'move') {
      let dx = p.x - g.x0, dy = p.y - g.y0;
      if (!g.moved && Math.hypot(dx, dy) * this.scale() < 3) return;
      g.moved = true;
      const rects = g.names.map(n => this.rects().get(n)).filter((r): r is Rect => !!r);
      if (!rects.length) return;
      const box = this.union(rects);
      const others = [...this.rects()].filter(([n]) => !g.names.includes(n)).map(([, r]) => r);
      const s = e.altKey ? { dx: 0, dy: 0, guides: [] } : snap({ ...box, x: box.x + dx, y: box.y + dy }, others);
      dx = Math.round(dx + s.dx);
      dy = Math.round(dy + s.dy);
      this.guides.set(s.guides);
      this.offset.set({ x: dx, y: dy });
      for (const n of g.names) this.element(n)?.style.setProperty('translate', `${dx}px ${dy}px`);
    } else if (g.kind === 'resize') {
      const b = this.slide().blocks.find(b => b.name === g.name);
      const r = this.resized(g.start, g.handle, p.x - g.x0, p.y - g.y0, e.shiftKey || (b?.type === 'image' && b.keepRatio));
      const el = this.element(g.name);
      if (!el) return;
      Object.assign(el.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.width}px` }, sideways(g.handle) ? {} : { height: `${r.height}px` });
      this.rects.update(m => new Map(m).set(g.name, { ...r, height: sideways(g.handle) ? el.offsetHeight : r.height }));
    } else if (g.kind === 'end') {
      const line = this.endMoved(g.name, g.end, p);
      const el = this.element(g.name);
      if (!line || !el) return;
      el.outerHTML = renderBlock(line, `/content/${slideFolder(this.slide().path)}`);
      this.rects.update(m => new Map(m).set(g.name, { x: line.x, y: line.y, width: line.width, height: line.height as number }));
    } else {
      this.marquee.set({ x: Math.min(g.x0, p.x), y: Math.min(g.y0, p.y), width: Math.abs(p.x - g.x0), height: Math.abs(p.y - g.y0) });
    }
  }

  up(e: PointerEvent) {
    const g = this.gesture;
    if (!g) return;
    if (g.kind === 'pen') {
      this.addDrawing(g.points);
    } else if (g.kind === 'move') {
      const { x, y } = this.offset();
      if (g.moved && (x || y)) this.store.moveBlocks(g.names, x, y);
      else if (!g.moved && !e.shiftKey) this.store.select([g.hit]);
    } else if (g.kind === 'resize') {
      const r = this.rects().get(g.name)!;
      const auto = sideways(g.handle) && this.slide().blocks.find(b => b.name === g.name)?.height === 'auto';
      this.store.resizeBlock(g.name, { ...r, height: auto ? 'auto' : r.height });
    } else if (g.kind === 'end') {
      const line = this.endMoved(g.name, g.end, this.point(e));
      if (line) this.store.updateBlocks([g.name], () => line);
    } else {
      const m = this.marquee();
      if (m && m.width + m.height > 2) this.store.select([...this.rects()].filter(([, r]) => intersects(m, r)).map(([n]) => n), g.additive);
      else if (!g.additive) this.store.select([]);
    }
    this.cancel();
  }

  cancel() {
    this.gesture = null;
    this.offset.set({ x: 0, y: 0 });
    this.guides.set([]);
    this.marquee.set(null);
    this.stroke.set('');
    for (const el of this.blockElements()) el.style.removeProperty('translate');
  }

  /** Double-click a text or table block to type into it; the text is written when it loses focus. */
  edit(e: MouseEvent) {
    const name = this.hit(e as PointerEvent);
    const block = this.slide().blocks.find(b => b.name === name);
    const el = name ? this.element(name) : undefined;
    if ((block?.type !== 'text' && block?.type !== 'table') || block.locked || !el) return;
    this.store.select([block.name]);
    this.editing.set(block.name);
    el.contentEditable = 'true';
    el.focus();
    document.getSelection()?.selectAllChildren(el);
    const done = (ev: FocusEvent) => {
      if ((ev.relatedTarget as HTMLElement | null)?.closest('.fmt')) return;
      el.removeEventListener('focusout', done);
      el.removeEventListener('keydown', escape);
      el.contentEditable = 'false';
      this.editing.set(null);
      const html = el.innerHTML.trim();
      if (html !== block.html.trim()) this.store.updateBlocks([block.name], b => ({ ...b, html }) as typeof b);
    };
    const escape = (ev: KeyboardEvent) => { if (ev.key === 'Escape') el.blur(); };
    el.addEventListener('focusout', done);
    el.addEventListener('keydown', escape);
  }

  /** A pen stroke becomes a drawing block the size of the stroke, its path in slide coordinates like the deck's drawings. */
  private addDrawing(points: Point[]) {
    if (points.length < 2) return;
    const pad = PEN.width / 2;
    const x = Math.floor(Math.min(...points.map(p => p.x)) - pad), y = Math.floor(Math.min(...points.map(p => p.y)) - pad);
    const width = Math.ceil(Math.max(...points.map(p => p.x)) + pad) - x, height = Math.ceil(Math.max(...points.map(p => p.y)) + pad) - y;
    const names = this.slide().blocks.map(b => b.name);
    let n = 1;
    while (names.includes(`drawing-${n}`)) n++;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none" width="100%" height="100%" viewBox="${x} ${y} ${width} ${height}">`
      + `<path fill="none" stroke="${PEN.color}" stroke-width="${PEN.width}" stroke-linecap="round" stroke-linejoin="round" d="${pointsToPath(points)}"></path></svg>`;
    this.store.addBlock({ type: 'drawing', name: `drawing-${n}`, x, y, width, height, z: Math.max(0, ...this.slide().blocks.map(b => b.z)) + 1, svg });
  }

  /** Clicking the format bar must not lose the text selection. */
  keepSelection(e: MouseEvent) {
    const sel = document.getSelection();
    if (sel?.rangeCount) this.range = sel.getRangeAt(0).cloneRange();
    if (!(e.target as HTMLElement).matches('input')) e.preventDefault();
  }

  // ponytail: document.execCommand for inline formatting; replace if Chromium drops it.
  format(command: string, value?: string) {
    const el = this.editing() && this.element(this.editing()!);
    if (!el) return;
    el.focus();
    const sel = document.getSelection();
    if (this.range && sel) {
      sel.removeAllRanges();
      sel.addRange(this.range);
    }
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand(command, false, value);
  }

  link() {
    const url = prompt('Link address');
    if (url) this.format('createLink', url);
  }

  private union(rs: Rect[]): Rect {
    const x = Math.min(...rs.map(r => r.x)), y = Math.min(...rs.map(r => r.y));
    return { x, y, width: Math.max(...rs.map(r => r.x + r.width)) - x, height: Math.max(...rs.map(r => r.y + r.height)) - y };
  }

  /** The box after dragging `handle` by (dx, dy); `keepRatio` holds the aspect ratio on corners. */
  private resized(s: Rect, handle: Handle, dx: number, dy: number, keepRatio: boolean): Rect {
    let { x, y, width, height } = s;
    if (handle.includes('e')) width = s.width + dx;
    if (handle.includes('w')) { width = s.width - dx; x = s.x + dx; }
    if (handle.includes('s')) height = s.height + dy;
    if (handle.startsWith('n')) { height = s.height - dy; y = s.y + dy; }
    if (keepRatio && handle.length === 2) {
      height = width * (s.height / s.width);
      if (handle.startsWith('n')) y = s.y + s.height - height;
    }
    if (width < MIN) { if (handle.includes('w')) x -= MIN - width; width = MIN; }
    if (height < MIN) { if (handle.startsWith('n')) y -= MIN - height; height = MIN; }
    return { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) };
  }

  /** The line with one end moved to `p` on the slide; its box is rebuilt around both ends. */
  private endMoved(name: string, end: 1 | 2, p: { x: number; y: number }): LineBlock | null {
    const b = this.slide().blocks.find(b => b.name === name);
    if (b?.type !== 'line') return null;
    const at = { x: Math.round(p.x), y: Math.round(p.y) };
    const p1 = end === 1 ? at : { x: b.x + b.x1, y: b.y + b.y1 };
    const p2 = end === 2 ? at : { x: b.x + b.x2, y: b.y + b.y2 };
    const x = Math.min(p1.x, p2.x), y = Math.min(p1.y, p2.y);
    const [x1, y1, x2, y2] = [p1.x - x, p1.y - y, p2.x - x, p2.y - y];
    return { ...b, x, y, x1, y1, x2, y2, width: Math.max(x1, x2), height: Math.max(y1, y2) };
  }
}
