import { Component, inject, input, signal } from '@angular/core';
import { Block, Border } from '../../deck/model';
import { EditorStore } from '../editor.store';
import { num, validPatch } from './num';
import { ColorFieldComponent } from './color-field.component';

const NEW_BORDER: Border = { width: 2, style: 'solid', color: '#ffffff', radius: 0 };

/** Settings every block has: name, position and size, border, depth, duplicate, lock, delete. */
@Component({
  selector: 'app-common-settings',
  imports: [ColorFieldComponent],
  template: `
    @let b = block();
    <div class="group">
      <span class="label">Block</span>
      <label class="row"><span>Name</span>
        <input class="field" [class.invalid]="nameError()" aria-label="Block name" [value]="b.name" (change)="rename($event)"></label>
      @if (nameError()) { <p class="error">{{ nameError() }}</p> }
    </div>
    <div class="group">
      <span class="label">Position and size</span>
      <div class="num4">
        <label><b>X</b><input type="number" aria-label="X" [value]="round(b.x)" (change)="set({ x: num($event) })"></label>
        <label><b>Y</b><input type="number" aria-label="Y" [value]="round(b.y)" (change)="set({ y: num($event) })"></label>
        <label><b>W</b><input type="number" aria-label="Width" min="1" [value]="round(b.width)" (change)="set({ width: num($event) })"></label>
        <label><b>H</b>
          @if (b.height === 'auto') { <input aria-label="Height" value="auto" disabled> }
          @else { <input type="number" aria-label="Height" min="1" [value]="round(b.height)" (change)="set({ height: num($event) })"> }
        </label>
      </div>
      <label class="row"><span>Border</span>
        <input type="checkbox" class="sw" aria-label="Border" [checked]="!!b.border" (change)="set({ border: b.border ? undefined : newBorder })"></label>
      @if (b.border; as border) {
        <div class="row"><span>Width</span><input type="number" class="field narrow" min="0" aria-label="Border width" [value]="border.width" (change)="setBorder({ width: num($event) })"></div>
        <div class="row"><span>Style</span><span class="seg">
          <button type="button" [class.on]="border.style === 'solid'" (click)="setBorder({ style: 'solid' })">Solid</button>
          <button type="button" [class.on]="border.style === 'dashed'" (click)="setBorder({ style: 'dashed' })">Dashed</button></span></div>
        <div class="row"><span>Color</span><app-color-field label="Border color" [value]="border.color" (valueChange)="setBorder({ color: $event })" /></div>
        <div class="row"><span>Corner radius</span><input type="number" class="field narrow" min="0" aria-label="Border radius" [value]="border.radius" (change)="setBorder({ radius: num($event) })"></div>
      }
    </div>
    <div class="group">
      <span class="label">Depth</span>
      <div class="iconrow">
        <button type="button" title="To back" (click)="store.setDepth([b.name], 'back')">⤓ Back</button>
        <button type="button" title="Backward" aria-label="Backward" (click)="store.setDepth([b.name], 'backward')">↓</button>
        <button type="button" title="Forward" aria-label="Forward" (click)="store.setDepth([b.name], 'forward')">↑</button>
        <button type="button" title="To front" (click)="store.setDepth([b.name], 'front')">⤒ Front</button>
      </div>
    </div>
    <div class="group">
      <div class="iconrow">
        <button type="button" (click)="store.duplicate([b.name])">Duplicate</button>
        <button type="button" [class.on]="b.locked" (click)="store.setLocked([b.name], !b.locked)">{{ b.locked ? '🔒 Locked' : 'Lock' }}</button>
        <button type="button" class="danger" (click)="store.deleteBlocks([b.name])">Delete</button>
      </div>
    </div>
  `,
})
export class CommonSettingsComponent {
  readonly store = inject(EditorStore);
  readonly block = input.required<Block>();
  readonly nameError = signal('');
  readonly newBorder = NEW_BORDER;
  readonly num = num;
  readonly round = (n: number) => Math.round(n * 100) / 100;

  set(patch: Partial<Block>, coalesce?: string) {
    if (!validPatch(patch) || (patch.width ?? 1) < 1 || (typeof patch.height === 'number' && patch.height < 1)) return;
    this.store.updateBlocks([this.block().name], b => ({ ...b, ...patch }) as Block, coalesce && `${coalesce}:${this.block().name}`);
  }

  setBorder(patch: Partial<Border>) {
    if (!validPatch(patch)) return;
    this.set({ border: { ...(this.block().border ?? NEW_BORDER), ...patch } }, patch.color ? 'border-color' : undefined);
  }

  rename(e: Event) {
    const input = e.target as HTMLInputElement;
    const ok = this.store.renameBlock(this.block().name, input.value);
    this.nameError.set(ok ? '' : `"${input.value.trim()}" is empty or already used on this slide.`);
  }
}
