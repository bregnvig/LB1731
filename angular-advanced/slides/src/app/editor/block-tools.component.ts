import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { blockNames } from '../deck/slide-format';
import { EditorStore } from './editor.store';
import { NewBlockType, newBlock } from './new-block';

interface Tool { type: NewBlockType | 'image' | 'pen' | 'table'; label: string; icon: string }

const TOOLS: Tool[] = [
  { type: 'text', label: 'Text', icon: '<path d="M3 3h10M8 3v10"/>' },
  { type: 'shape', label: 'Shape', icon: '<rect x="2.5" y="2.5" width="7" height="7"/><circle cx="10.5" cy="10.5" r="3.5"/>' },
  { type: 'image', label: 'Image', icon: '<rect x="2" y="3" width="12" height="10" rx="1"/><path d="M2 11l4-4 3 3 2-2 3 3"/>' },
  { type: 'pen', label: 'Pen', icon: '<path d="M2 13c3-1 3-6 6-6s2 5 6 3"/>' },
  { type: 'line', label: 'Line', icon: '<path d="M3 13L13 3"/>' },
  { type: 'arrow', label: 'Arrow', icon: '<path d="M3 13L13 3M7 3h6v6"/>' },
  { type: 'table', label: 'Table', icon: '<rect x="2" y="3" width="12" height="10"/><path d="M2 7h12M7 3v10"/>' },
  { type: 'code', label: 'Code', icon: '<path d="M6 4L2 8l4 4M10 4l4 4-4 4"/>' },
];

/** The image's own size; SVGs without one count as 400×300. */
function naturalSize(file: Blob): Promise<{ width: number; height: number }> {
  const url = URL.createObjectURL(file);
  return new Promise(ok => {
    const img = new Image();
    const done = (width: number, height: number) => { URL.revokeObjectURL(url); ok({ width, height }); };
    img.onload = () => done(img.naturalWidth || 400, img.naturalHeight || 300);
    img.onerror = () => done(400, 300);
    img.src = url;
  });
}

/** The insert bar above the canvas: adds a block in the middle of the slide and selects it. */
@Component({
  selector: 'app-block-tools',
  template: `
    @for (t of tools; track t.type) {
      <button type="button" [class.on]="t.type === 'pen' && store.tool() === 'pen'" [attr.aria-pressed]="t.type === 'pen' ? store.tool() === 'pen' : null"
        (click)="t.type === 'image' ? picker.click() : add(t)">
        <svg viewBox="0 0 16 16" aria-hidden="true" [innerHTML]="t.svg"></svg>{{ t.label }}
      </button>
    }
    <input #picker type="file" accept=".png,.jpg,.jpeg,.gif,.svg" hidden data-testid="image-picker" (change)="addImage(picker)">
  `,
  styles: `
    :host { display: flex; gap: 2px; background: var(--ink); padding: 4px; border-radius: 999px; box-shadow: 0 6px 20px rgba(0,0,0,.15); align-self: center; margin-top: 14px; }
    button { border: 0; background: none; color: #e9e6df; display: flex; align-items: center; gap: 6px; padding: 6px 11px; border-radius: 999px; cursor: pointer; font-size: 12px; }
    button:hover:not(:disabled) { background: #3a3833; }
    button.on { background: var(--accent); }
    button:focus-visible { outline: 2px solid var(--accent-soft); }
    svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 1.6; }
  `,
})
export class BlockToolsComponent {
  readonly store = inject(EditorStore);
  // The icons are our own constants, so they can skip sanitizing (which would drop the SVG).
  readonly tools = TOOLS.map(t => ({ ...t, svg: inject(DomSanitizer).bypassSecurityTrustHtml(t.icon) }));

  add(t: Tool) {
    const slide = this.store.slide();
    if (!slide || t.type === 'image') return;
    if (t.type === 'pen') {
      this.store.tool.update(tool => (tool === 'pen' ? 'select' : 'pen'));
      return;
    }
    const b = newBlock(t.type, blockNames(slide), { x: 0, y: 0 }, this.topZ());
    const height = b.height === 'auto' ? 40 : b.height;
    this.store.addBlock({ ...b, x: Math.round(640 - b.width / 2), y: Math.round(360 - height / 2) });
  }

  /** Uploads the picked image and adds it in the middle of the slide, at most 640×480 at its own ratio. */
  async addImage(picker: HTMLInputElement) {
    const file = picker.files?.[0];
    picker.value = '';
    const slide = this.store.slide();
    if (!file || !slide) return;
    const src = await this.store.storeImage(file);
    if (!src) return;
    const { width, height } = await naturalSize(file);
    const k = Math.min(1, 640 / width, 480 / height);
    const w = Math.round(width * k), h = Math.round(height * k);
    let n = 1;
    while (blockNames(slide).includes(`image-${n}`)) n++;
    this.store.addBlock({
      type: 'image', name: `image-${n}`, x: Math.round(640 - w / 2), y: Math.round(360 - h / 2), width: w, height: h, z: this.topZ(),
      src, alt: '', inlineSvg: false, svgColor: null, imgStyle: '', keepRatio: true,
    });
  }

  private topZ() {
    return Math.max(0, ...(this.store.slide()?.blocks ?? []).map(b => b.z)) + 1;
  }
}
