import { Location } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanvasComponent } from './canvas.component';
import { EditorStore } from './editor.store';
import { LayersComponent } from './layers.component';
import { SlideListComponent } from './slide-list.component';

const fileOf = (path: string) => path.slice(path.lastIndexOf('/') + 1);
const typing = (e: Event) => (e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]') != null;

/** The editor: slide list, canvas, inspector and notes. Routes: /edit and /edit/:course/:file (course "intro" for the intro). */
@Component({
  selector: 'app-editor',
  imports: [CanvasComponent, LayersComponent, SlideListComponent],
  host: { '(window:keydown)': 'key($event)' },
  template: `
    <header>
      <span class="brand"><i></i>adv slides</span>
      <select class="course" aria-label="Course" (change)="openCourse($any($event.target).value)">
        <option value="intro" [selected]="store.courseId() == null">Intro</option>
        @for (c of store.deck()?.courses; track c.id) { <option [value]="c.id" [selected]="c.id === store.courseId()">{{ c.title }}</option> }
      </select>
      @if (store.slide(); as s) {
        <span class="crumb">{{ number() }} · <b>{{ fileOf(s.path) }}</b></span>
      }
      <span class="spacer"></span>
      <button type="button" class="ghost" title="Undo (Ctrl+Z)" (click)="store.undo()">↶ Undo</button>
      <button type="button" class="ghost" title="Redo (Ctrl+Shift+Z)" (click)="store.redo()">↷ Redo</button>
      <span class="status" [class]="store.status()" data-testid="status">{{ statusText() }}</span>
      <span class="spacer"></span>
      @if (pdfMessage()) { <span class="hint" data-testid="pdf">{{ pdfMessage() }}</span> }
      <button type="button" class="btn" [disabled]="exporting()" (click)="exportPdf()">Export PDF</button>
      <button type="button" class="btn" (click)="open('/presenter')">Presenter view</button>
      <button type="button" class="btn primary" (click)="present()">▶ Present</button>
    </header>

    <nav>
      <div class="navhead">
        <span class="label">{{ courseTitle() }} · {{ store.slides().length }} slides</span>
        <button type="button" class="ghost" [class.on]="overview()" title="Overview: drag to reorder" (click)="overview.set(!overview())">▦ Overview</button>
      </div>
      <app-slide-list />
    </nav>

    <main>
      @if (store.status() === 'conflict') {
        <div class="banner" role="alert">
          This slide changed on disk since it was opened. Your last edits aren't saved.
          <button type="button" class="btn" (click)="store.reloadSlide()">Reload from disk</button>
        </div>
      }
      @if (overview()) {
        <app-slide-list class="overview" [grid]="true" />
      } @else if (store.slide(); as s) {
        <app-canvas [slide]="s" />
        <div class="stagefoot"><kbd>↑</kbd><kbd>↓</kbd> move between slides · <kbd>Shift</kbd>+click to multi-select · <kbd>Alt</kbd> while dragging: no guides · <kbd>Ctrl</kbd>+<kbd>Z</kbd> undo</div>
      }
    </main>

    <aside>
      <div class="tabs" role="tablist">
        <button type="button" role="tab" [class.on]="tab() === 'block'" [attr.aria-selected]="tab() === 'block'" (click)="tab.set('block')">Block</button>
        <button type="button" role="tab" disabled>Motion</button>
        <button type="button" role="tab" [class.on]="tab() === 'layers'" [attr.aria-selected]="tab() === 'layers'" (click)="tab.set('layers')">Layers</button>
        <span class="kind">{{ kind() }}</span>
      </div>
      <div class="panel">
        @if (tab() === 'layers') {
          <app-layers />
        } @else if (store.selection().length) {
          <div class="group">
            <span class="label">{{ store.selection().length === 1 ? store.selection()[0] : store.selection().length + ' blocks' }}</span>
            <p class="hint">Drag to move, handles to resize, arrow keys to nudge (Shift: 10 px). Delete removes.</p>
          </div>
        } @else if (store.slide(); as s) {
          <div class="group">
            <span class="label">Slide</span>
            <div class="row"><span>File</span><span class="mono">{{ fileOf(s.path) }}</span></div>
            <label class="row"><span>Hidden from the deck</span>
              <input type="checkbox" class="sw" [checked]="s.hidden" (change)="store.setHidden($any($event.target).checked)"></label>
            <label class="row"><span>Auto-animate from previous</span>
              <input type="checkbox" class="sw" [checked]="s.autoAnimate" (change)="store.setAutoAnimate($any($event.target).checked)"></label>
          </div>
          <div class="group">
            <button type="button" class="btn danger wide" [disabled]="store.slides().length < 2" (click)="deleteSlide()">Delete slide</button>
          </div>
        }
      </div>
      <div class="notes">
        <label class="row"><span class="label">Speaker notes</span><span class="hint">saved with the slide</span></label>
        <textarea aria-label="Speaker notes" [value]="store.slide()?.notes ?? ''" (input)="store.setNotes($any($event.target).value)"></textarea>
      </div>
    </aside>
  `,
  styles: `
    :host {
      --paper: #f3f1ec; --panel: #fbfaf7; --line: #dedad2; --ink: #1f1e1b; --muted: #77736a;
      --accent: #0f766e; --accent-soft: #d5ece8; --guide: #d4237a; --radius: 6px;
      position: absolute; inset: 0; display: grid; grid-template: 48px minmax(0, 1fr) / 232px minmax(0, 1fr) 320px;
      font: 13px/1.4 'IBM Plex Sans', system-ui, sans-serif; color: var(--ink); background: var(--paper);
    }
    button, select, input, textarea { font: inherit; color: inherit; }
    .mono, kbd { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
    header { grid-column: 1 / -1; display: flex; align-items: center; gap: 14px; padding: 0 14px; background: var(--panel); border-bottom: 1px solid var(--line); }
    .brand { font-weight: 600; letter-spacing: .02em; display: flex; align-items: center; gap: 8px; }
    .brand i { width: 18px; height: 12px; border: 2px solid var(--ink); border-radius: 2px; position: relative; }
    .brand i::after { content: ''; position: absolute; left: 3px; top: 2px; width: 6px; height: 2px; background: var(--accent); }
    .course { border: 1px solid var(--line); background: #fff; border-radius: var(--radius); padding: 4px 8px; }
    .crumb { color: var(--muted); } .crumb b { color: var(--ink); font-weight: 500; }
    .spacer { flex: 1; }
    .ghost { border: 0; background: none; padding: 6px 8px; border-radius: var(--radius); cursor: pointer; color: var(--muted); }
    .ghost:hover, .ghost.on { background: #ebe8e1; color: var(--ink); }
    .status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--accent); }
    .status::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
    .status.saving { color: var(--muted); } .status.conflict, .status.error { color: #b42318; }
    .btn { border: 1px solid var(--line); background: #fff; padding: 5px 12px; border-radius: var(--radius); cursor: pointer; }
    .btn:hover:not(:disabled) { border-color: #c9c4b9; } .btn:disabled { opacity: .5; cursor: default; }
    .btn.primary { background: var(--ink); color: #fff; border-color: var(--ink); }
    .btn.danger { color: #b42318; } .btn.wide { width: 100%; }
    nav { background: var(--panel); border-right: 1px solid var(--line); overflow: auto; padding: 10px 10px 40px; }
    .navhead { display: flex; align-items: center; justify-content: space-between; margin: 4px 2px 10px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 500; }
    main { position: relative; display: flex; flex-direction: column; min-height: 0; padding-bottom: 14px; }
    app-canvas { flex: 1; }
    .overview { flex: 1; overflow: auto; padding: 24px; }
    .stagefoot { text-align: center; color: var(--muted); font-size: 12px; }
    kbd { font-size: 11px; border: 1px solid var(--line); border-bottom-width: 2px; border-radius: 4px; padding: 0 5px; background: #fff; }
    .banner { margin: 12px 24px 0; padding: 8px 12px; background: #fdecea; border: 1px solid #f3b8b2; border-radius: var(--radius); display: flex; align-items: center; gap: 12px; justify-content: space-between; }
    aside { background: var(--panel); border-left: 1px solid var(--line); display: grid; grid-template-rows: auto minmax(0, 1fr) auto; }
    .tabs { display: flex; border-bottom: 1px solid var(--line); padding: 0 8px; }
    .tabs button { border: 0; background: none; padding: 11px 10px 9px; cursor: pointer; color: var(--muted); border-bottom: 2px solid transparent; font-weight: 500; }
    .tabs button.on { color: var(--ink); border-bottom-color: var(--accent); } .tabs button:disabled { opacity: .5; cursor: default; }
    .kind { margin-left: auto; align-self: center; font-size: 11px; background: var(--accent-soft); color: var(--accent); padding: 2px 8px; border-radius: 999px; }
    .panel { overflow: auto; padding: 4px 14px 14px; }
    .group { padding: 12px 0; border-bottom: 1px solid #ebe8e1; } .group:last-child { border-bottom: 0; }
    .group > .label { display: block; margin-bottom: 8px; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 7px 0; }
    .row > span:first-child:not(.label) { color: var(--muted); }
    .hint { color: var(--muted); font-size: 11.5px; }
    .sw { appearance: none; margin: 0; width: 30px; height: 17px; border-radius: 999px; background: #d6d2c9; position: relative; cursor: pointer; flex: none; }
    .sw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 13px; height: 13px; border-radius: 50%; background: #fff; transition: left .15s; }
    .sw:checked { background: var(--accent); } .sw:checked::after { left: 15px; }
    .sw:focus-visible, .btn:focus-visible, .ghost:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .notes { border-top: 1px solid var(--line); padding: 10px 14px 14px; }
    .notes .row { margin: 0 0 6px; }
    .notes textarea { width: 100%; height: 140px; resize: vertical; border: 1px solid var(--line); border-radius: var(--radius); padding: 8px; background: #fff; line-height: 1.45; box-sizing: border-box; }
  `,
})
export class EditorComponent {
  readonly store = inject(EditorStore);
  private readonly location = inject(Location);
  readonly fileOf = fileOf;
  readonly overview = signal(false);
  readonly tab = signal<'block' | 'layers'>('block');
  readonly exporting = signal(false);
  readonly pdfMessage = signal('');

  constructor() {
    const params = inject(ActivatedRoute).snapshot.paramMap;
    void this.store.load().then(() => {
      const course = params.get('course');
      this.store.openCourse(course && course !== 'intro' ? course : null);
      const at = this.store.slides().findIndex(s => fileOf(s.path) === params.get('file'));
      if (at > 0) this.store.openSlide(at);
    });
    // The address bar follows the open slide, so a reload comes back to it.
    effect(() => {
      const s = this.store.slide();
      if (s) this.location.replaceState(`/edit/${this.store.courseId() ?? 'intro'}/${fileOf(s.path)}`);
    });
  }

  kind() {
    const sel = this.store.selection();
    if (!sel.length) return 'Slide';
    if (sel.length > 1) return `${sel.length} blocks`;
    const type = this.store.slide()?.blocks.find(b => b.name === sel[0])?.type ?? '';
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  courseTitle() {
    const id = this.store.courseId();
    return id == null ? 'Intro' : this.store.deck()?.courses.find(c => c.id === id)?.title ?? id;
  }

  number() {
    const at = this.store.revealIndices(this.store.slideIndex());
    return at ? `${at.h + 1}.${at.v + 1}` : 'hidden';
  }

  statusText() {
    return { saved: 'Saved to disk', saving: 'Saving…', conflict: 'Changed on disk', error: `Not saved: ${this.store.error()}` }[this.store.status()];
  }

  openCourse(id: string) {
    this.store.openCourse(id === 'intro' ? null : id);
  }

  async deleteSlide() {
    const s = this.store.slide();
    if (s && confirm(`Delete ${fileOf(s.path)}? The file is removed from disk.`)) await this.store.deleteSlide();
  }

  open(url: string) {
    window.open(url, '_blank');
  }

  present() {
    const at = this.store.revealIndices(this.store.slideIndex());
    this.open(at ? `/present#/${at.h}/${at.v}` : '/present');
  }

  async exportPdf() {
    this.exporting.set(true);
    this.pdfMessage.set('Exporting PDF…');
    try {
      const res = await fetch('/api/pdf', { method: 'POST' });
      this.pdfMessage.set(res.ok ? `PDF: ${(await res.json()).path}` : `PDF failed: ${await res.text()}`);
    } finally {
      this.exporting.set(false);
    }
  }

  key(e: KeyboardEvent) {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'z' && !typing(e)) {
      e.preventDefault();
      if (e.shiftKey) this.store.redo(); else this.store.undo();
      return;
    }
    if (mod || typing(e)) return;
    const sel = this.store.selection();
    const nudge: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (sel.length && nudge[e.key]) {
      const step = e.shiftKey ? 10 : 1;
      this.store.moveBlocks(sel, nudge[e.key][0] * step, nudge[e.key][1] * step, 'nudge');
    } else if (sel.length && (e.key === 'Delete' || e.key === 'Backspace')) {
      this.store.deleteBlocks(sel);
    } else if (e.key === 'Escape') {
      this.store.select([]);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      this.store.openSlide(this.store.slideIndex() + (e.key === 'ArrowUp' ? -1 : 1));
    } else {
      return;
    }
    e.preventDefault();
  }
}
