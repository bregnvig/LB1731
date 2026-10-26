import { Component, inject, input, signal } from '@angular/core';
import { Block, CodeBlock, LineBlock, ShapeBlock, TextBlock } from '../../deck/model';
import { EditorStore } from '../editor.store';
import { LINE_SPEC } from '../new-block';
import { ColorFieldComponent } from './color-field.component';

/** Reads one declaration from an inline style ("font-size: 20px; color: red"). */
export function getDecl(style: string | undefined, prop: string): string | null {
  const m = new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`).exec(style ?? '');
  return m ? m[1].trim() : null;
}

/** Sets (or with null removes) one declaration in an inline style, keeping the others. */
export function setDecl(style: string | undefined, prop: string, value: string | null): string {
  const rest = (style ?? '').split(';').map(d => d.trim()).filter(d => d && !new RegExp(`^${prop}\\s*:`).test(d));
  return [...rest, ...(value == null ? [] : [`${prop}: ${value}`])].map(d => `${d};`).join(' ');
}

const LANGUAGES = [
  { id: 'typescript', label: 'TypeScript' }, { id: 'xml', label: 'HTML' }, { id: 'bash', label: 'bash' },
  { id: 'auto', label: 'Detect' }, { id: 'plaintext', label: 'Plain' },
];
const num = (e: Event) => Number((e.target as HTMLInputElement).value);

/** The settings that depend on the block type: text, code, shape and line. */
@Component({
  selector: 'app-type-settings',
  imports: [ColorFieldComponent],
  template: `
    @let b = block();
    @switch (b.type) {
      @case ('text') {
        <div class="group">
          <span class="label">Text</span>
          <div class="row"><span>Alignment</span><span class="seg">
            @for (a of aligns; track a) { <button type="button" [class.on]="(text().align ?? 'left') === a" (click)="set({ align: a })">{{ a[0].toUpperCase() + a.slice(1) }}</button> }
          </span></div>
          <div class="row"><span>Color</span>
            <app-color-field label="Text color" [value]="decl(b.extraStyle, 'color') ?? '#ffffff'" (valueChange)="set({ extraStyle: setDecl(b.extraStyle, 'color', $event || null) || undefined }, 'color')" /></div>
          <p class="hint">Double-click the text on the canvas to edit it. Headings, bold, italic, color and links are in the bar above the text.</p>
        </div>
      }
      @case ('code') {
        <div class="group">
          <span class="label">Code</span>
          <textarea class="code" aria-label="Code" spellcheck="false" [value]="code().code" (input)="set({ code: $any($event.target).value }, 'code')"></textarea>
          <label class="row"><span>Language</span>
            <select class="field" aria-label="Language" (change)="set({ lang: $any($event.target).value })">
              @for (l of languages; track l.id) { <option [value]="l.id" [selected]="l.id === code().lang">{{ l.label }}</option> }
              @if (!knownLanguage()) { <option [value]="code().lang" selected>{{ code().lang }}</option> }
            </select></label>
          <div class="row"><span>Theme</span><span class="seg">
            <button type="button" [class.on]="code().theme === 'dark'" (click)="set({ theme: 'dark' })">Dark</button>
            <button type="button" [class.on]="code().theme === 'monokai'" (click)="set({ theme: 'monokai' })">Monokai</button></span></div>
          <div class="row"><span>Window frame</span><span class="seg">
            <button type="button" [class.on]="code().frame === 'none'" (click)="set({ frame: 'none' })">None</button>
            <button type="button" [class.on]="code().frame === 'macos'" (click)="set({ frame: 'macos' })">macOS</button></span></div>
          <label class="row"><span>Text size (px)</span>
            <input type="number" class="field narrow" min="6" aria-label="Text size" [value]="fontSize()" (change)="setFontSize(num($event))"></label>
          <label class="row"><span>Automatic height</span>
            <input type="checkbox" class="sw" [checked]="code().autoHeight" (change)="set({ autoHeight: $any($event.target).checked })"></label>
          <label class="row"><span>Line numbers</span>
            <input type="checkbox" class="sw" [checked]="code().lines != null" (change)="set({ lines: $any($event.target).checked ? '' : null })"></label>
          @if (code().lines != null) {
            <label class="row"><span>Highlight lines</span>
              <input class="field mono" [class.invalid]="linesError()" aria-label="Highlight lines" placeholder="2,4-6|8" [value]="code().lines" (change)="setLines($any($event.target).value)"></label>
            @if (linesError()) { <p class="error">{{ linesError() }}</p> }
          }
        </div>
      }
      @case ('shape') {
        <div class="group">
          <span class="label">Shape</span>
          <div class="row"><span>Shape</span><span class="seg">
            <button type="button" [class.on]="shape().shape === 'rect'" (click)="set({ shape: 'rect' })">Rectangle</button>
            <button type="button" [class.on]="shape().shape === 'circle'" (click)="set({ shape: 'circle' })">Circle</button></span></div>
          <div class="row"><span>Fill</span><app-color-field label="Fill" [value]="shape().fill" (valueChange)="set({ fill: $event }, 'fill')" /></div>
          <div class="row"><span>Stroke</span><app-color-field label="Stroke color" [value]="shape().stroke ?? '#ffffff'" (valueChange)="set({ stroke: $event, strokeWidth: shape().strokeWidth || 2 }, 'stroke')" /></div>
          <label class="row"><span>Stroke width (0 = none)</span>
            <input type="number" class="field narrow" min="0" aria-label="Stroke width" [value]="shape().stroke ? shape().strokeWidth : 0" (change)="setStrokeWidth(num($event))"></label>
          @if (shape().shape === 'rect') {
            <label class="row"><span>Corner radius</span>
              <input type="number" class="field narrow" min="0" aria-label="Corner radius" [value]="shape().radius" (change)="set({ radius: num($event) })"></label>
          }
        </div>
      }
      @case ('line') {
        <div class="group">
          <span class="label">Line</span>
          <div class="row"><span>Style</span><span class="seg">
            <button type="button" [class.on]="!line().dashed" (click)="set({ dashed: false })">Solid</button>
            <button type="button" [class.on]="line().dashed" (click)="set({ dashed: true })">Dashed</button></span></div>
          <div class="row"><span>Arrowheads</span><span class="seg">
            <button type="button" [class.on]="line().start === 'arrow'" (click)="set({ start: line().start === 'arrow' ? 'none' : 'arrow' })">◀ Start</button>
            <button type="button" [class.on]="line().end === 'arrow'" (click)="set({ end: line().end === 'arrow' ? 'none' : 'arrow' })">End ▶</button></span></div>
          <label class="row"><span>Thickness</span>
            <input type="number" class="field narrow" min="1" aria-label="Thickness" [value]="line().thickness" (change)="set({ thickness: num($event) })"></label>
          <div class="row"><span>Color</span><app-color-field label="Line color" [value]="line().color" (valueChange)="set({ color: $event }, 'color')" /></div>
          <p class="hint">Drag the end points on the canvas.</p>
        </div>
      }
    }
  `,
})
export class TypeSettingsComponent {
  readonly store = inject(EditorStore);
  readonly block = input.required<Block>();
  readonly linesError = signal('');
  readonly aligns = ['left', 'center', 'right', 'justify'] as const;
  readonly languages = LANGUAGES;
  readonly decl = getDecl;
  readonly setDecl = setDecl;
  readonly num = num;

  readonly text = () => this.block() as TextBlock;
  readonly code = () => this.block() as CodeBlock;
  readonly shape = () => this.block() as ShapeBlock;
  readonly line = () => this.block() as LineBlock;
  readonly knownLanguage = () => LANGUAGES.some(l => l.id === this.code().lang);
  readonly fontSize = () => parseFloat(getDecl(this.code().preStyle, 'font-size') ?? '20');

  /** `coalesce` names a field typed into or dragged, so one edit is one undo step. */
  set(patch: Record<string, unknown>, coalesce?: string) {
    this.store.updateBlocks([this.block().name], b => ({ ...b, ...patch }) as Block, coalesce && `${coalesce}:${this.block().name}`);
  }

  /** Line height follows the size at the deck's ratio of 1.2. */
  setFontSize(px: number) {
    if (!(px > 0)) return;
    const style = setDecl(setDecl(this.code().preStyle, 'font-size', `${px}px`), 'line-height', `${Math.round(px * 1.2)}px`);
    this.set({ preStyle: style });
  }

  setLines(v: string) {
    v = v.replace(/\s/g, '');
    if (!LINE_SPEC.test(v)) return this.linesError.set('Use line numbers and ranges like 2,4-6, with | between steps.');
    this.linesError.set('');
    this.set({ lines: v });
  }

  setStrokeWidth(w: number) {
    this.set(w > 0 ? { strokeWidth: w, stroke: this.shape().stroke ?? '#ffffff' } : { strokeWidth: 0, stroke: null });
  }
}
