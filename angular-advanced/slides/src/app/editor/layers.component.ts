import { Component, computed, inject, signal } from '@angular/core';
import { EditorStore } from './editor.store';

const TYPE_LABEL: Record<string, string> = { text: 'TXT', code: '</>', shape: 'SHP', line: 'LN', image: 'IMG', table: 'TBL', drawing: 'PEN', group: 'GRP' };

/** The blocks of the slide, front to back: click to select, drag to restack, lock and unlock. */
@Component({
  selector: 'app-layers',
  template: `
    <p class="hint">Top of the list is in front. Drag to reorder.</p>
    @for (b of layers(); track b.name; let i = $index) {
      <div class="layer" [class.on]="selected().has(b.name)" [class.over]="over() === i" draggable="true" [attr.data-layer]="b.name"
        (click)="store.select([b.name], $event.shiftKey)" (dragstart)="dragged = b.name"
        (dragover)="$event.preventDefault(); over.set(i)" (dragleave)="over.set(-1)" (drop)="drop(i)">
        <span class="grip" aria-hidden="true">⋮⋮</span>
        <span class="ty">{{ label[b.type] }}</span>
        <span class="name">{{ b.name }}</span>
        <span class="marks">
          @if (b.animation) { <span title="Animated">✦</span> }
          <button type="button" class="lock" [class.locked]="b.locked" [title]="b.locked ? 'Unlock' : 'Lock'"
            [attr.aria-label]="(b.locked ? 'Unlock ' : 'Lock ') + b.name" (click)="$event.stopPropagation(); store.setLocked([b.name], !b.locked)">
            {{ b.locked ? '🔒' : '🔓' }}</button>
        </span>
      </div>
    } @empty {
      <p class="hint">No blocks on this slide yet.</p>
    }
  `,
  styles: `
    .hint { color: var(--muted); font-size: 11.5px; margin: 12px 0 6px; }
    .layer { display: grid; grid-template-columns: 14px 28px 1fr auto; align-items: center; gap: 6px; padding: 5px 6px; border-radius: var(--radius); cursor: pointer; }
    .layer:hover { background: #f0ede7; }
    .layer.on { background: var(--accent-soft); }
    .layer.over { box-shadow: inset 0 2px 0 var(--guide); }
    .grip { color: #b8b3a8; letter-spacing: -2px; font-size: 10px; cursor: grab; }
    .ty { font: 500 10px 'IBM Plex Mono', monospace; color: var(--muted); }
    .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .marks { display: flex; gap: 4px; align-items: center; color: var(--muted); }
    .lock { border: 0; background: none; cursor: pointer; opacity: .35; padding: 0 2px; font-size: 12px; }
    .lock.locked, .layer:hover .lock { opacity: 1; }
  `,
})
export class LayersComponent {
  readonly store = inject(EditorStore);
  readonly label = TYPE_LABEL;
  readonly layers = computed(() => [...(this.store.slide()?.blocks ?? [])].sort((a, b) => b.z - a.z));
  readonly selected = computed(() => new Set(this.store.selection()));
  readonly over = signal(-1);
  dragged = '';

  drop(index: number) {
    this.over.set(-1);
    if (this.dragged) this.store.moveLayer(this.dragged, index);
    this.dragged = '';
  }
}
