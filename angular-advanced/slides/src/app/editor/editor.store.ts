import { Injectable, computed, inject, signal } from '@angular/core';
import { ConflictError, DeckService } from '../deck/deck.service';
import { Block, Deck, Slide } from '../deck/model';
import { blockNames } from '../deck/slide-format';
import { safeImageName, uniqueImageName } from './media';

export type SaveStatus = 'saved' | 'saving' | 'conflict' | 'error';

const MAX_HISTORY = 100;

/** Applies `fn` to every block, group children included. */
const mapDeep = (blocks: Block[], fn: (b: Block) => Block): Block[] =>
  blocks.map(b => {
    const m = fn(b);
    return m.type === 'group' ? { ...m, children: mapDeep(m.children, fn) } : m;
  });
const retrigger = (from: Set<string>, to: string | null) => (b: Block): Block =>
  b.animation?.on && from.has(b.animation.on) ? { ...b, animation: { ...b.animation, on: to } } : b;
const folderOf = (path: string) => path.slice(0, path.lastIndexOf('/'));

/**
 * The editor's state. Slide edits go through `updateSlide`, which records undo history per slide
 * and writes the file 500 ms after the last change; a failed write is retried. A file changed on
 * disk by someone else (a slide or an order file) is never overwritten: it stops saving, the other
 * files keep saving, and `reloadConflicts` takes the files from disk.
 */
@Injectable({ providedIn: 'root' })
export class EditorStore {
  private readonly service = inject(DeckService);

  readonly deck = signal<Deck | null>(null);
  /** null is the intro. */
  readonly courseId = signal<string | null>(null);
  readonly slideIndex = signal(0);
  readonly selection = signal<string[]>([]);
  /** Files changed on disk since they were loaded: slide paths and order files (deck.json). */
  readonly conflicts = signal<string[]>([]);
  /** The last failed write, until a write succeeds. */
  readonly error = signal('');
  private readonly writing = signal(0);
  readonly status = computed<SaveStatus>(() =>
    this.conflicts().length ? 'conflict' : this.error() ? 'error' : this.writing() ? 'saving' : 'saved');
  /** A message for the user that isn't about saving (a refused upload…). */
  readonly notice = signal('');
  /** 'pen' while drawing: dragging on the canvas draws instead of selecting. */
  readonly tool = signal<'select' | 'pen'>('select');

  readonly slides = computed(() => {
    const deck = this.deck(), id = this.courseId();
    if (!deck) return [];
    return id == null ? deck.intro : deck.courses.find(c => c.id === id)?.slides ?? [];
  });
  readonly slide = computed<Slide | undefined>(() => this.slides()[this.slideIndex()]);

  // Blocks. Names are unique on a slide; these work on the top-level blocks.

  select(names: string[], additive = false) {
    if (!additive) return this.selection.set(names);
    const now = new Set(this.selection());
    for (const n of names) if (now.has(n)) now.delete(n); else now.add(n);
    this.selection.set([...now]);
  }

  /** Uploads an image into the current slide's folder under a safe, unused name; returns its path relative to the folder. */
  async storeImage(file: File): Promise<string | null> {
    const slide = this.slide();
    const name = safeImageName(file.name);
    if (!slide || !name) {
      this.notice.set(`${file.name} isn't a PNG, JPG, GIF or SVG image.`);
      return null;
    }
    const dir = folderOf(slide.path);
    const unique = await uniqueImageName(name, n => this.service.imageExists(dir, n));
    const rel = await this.guard(() => this.service.uploadImage(dir, file, unique));
    if (rel) this.notice.set('');
    return rel ?? null;
  }

  addBlock(block: Block) {
    this.updateSlide(s => ({ ...s, blocks: [...s.blocks, block] }));
    this.selection.set([block.name]);
  }

  /** Changes the named blocks (all blocks with `names` = null). */
  updateBlocks(names: string[] | null, fn: (b: Block) => Block, coalesce?: string) {
    const set = names && new Set(names);
    this.updateSlide(s => ({ ...s, blocks: s.blocks.map(b => (!set || set.has(b.name) ? fn(b) : b)) }), coalesce);
  }

  moveBlocks(names: string[], dx: number, dy: number, coalesce?: string) {
    this.updateBlocks(names, b => (b.locked ? b : { ...b, x: b.x + dx, y: b.y + dy }), coalesce);
  }

  resizeBlock(name: string, rect: { x: number; y: number; width: number; height: number | 'auto' }) {
    this.updateBlocks([name], b => (b.locked ? b : { ...b, ...rect } as Block));
  }

  setLocked(names: string[], locked: boolean) {
    this.updateBlocks(names, b => ({ ...b, locked: locked || undefined }));
  }

  /** Restacks by handing the existing z values out again in the new order, so other blocks keep theirs. */
  setDepth(names: string[], op: 'back' | 'backward' | 'forward' | 'front') {
    const blocks = this.slide()?.blocks ?? [];
    const order = [...blocks].sort((a, b) => a.z - b.z).map(b => b.name);
    const moving = new Set(names);
    const rest = order.filter(n => !moving.has(n)), picked = order.filter(n => moving.has(n));
    let next: string[];
    if (op === 'front') next = [...rest, ...picked];
    else if (op === 'back') next = [...picked, ...rest];
    else {
      next = [...order];
      const step = op === 'forward' ? 1 : -1;
      const indices = picked.map(n => next.indexOf(n));
      for (const i of step === 1 ? indices.reverse() : indices) {
        const j = i + step;
        if (j < 0 || j >= next.length || moving.has(next[j])) continue;
        [next[i], next[j]] = [next[j], next[i]];
      }
    }
    this.restack(next);
  }

  /** Moves one block to position `index` in the layers list, which runs from front to back. */
  moveLayer(name: string, index: number) {
    const order = [...(this.slide()?.blocks ?? [])].sort((a, b) => b.z - a.z).map(b => b.name).filter(n => n !== name);
    order.splice(index, 0, name);
    this.restack(order.reverse());
  }

  duplicate(names: string[]) {
    const s = this.slide();
    if (!s) return;
    const taken = new Set(blockNames(s));
    let z = Math.max(0, ...s.blocks.map(b => b.z));
    const copies = s.blocks.filter(b => names.includes(b.name)).map(b => {
      let name = `${b.name}-copy`;
      for (let n = 2; taken.has(name); n++) name = `${b.name}-copy-${n}`;
      taken.add(name);
      return { ...structuredClone(b), name, x: b.x + 20, y: b.y + 20, z: ++z, locked: undefined } as Block;
    });
    this.updateSlide(sl => ({ ...sl, blocks: [...sl.blocks, ...copies] }));
    this.selection.set(copies.map(c => c.name));
  }

  /** Animations started by a click on a deleted block (or on a block inside a deleted group) start on entry instead. */
  deleteBlocks(names: string[]) {
    const s = this.slide();
    if (!s) return;
    const deleted = s.blocks.filter(b => names.includes(b.name));
    const gone = new Set(blockNames({ ...s, blocks: deleted }));
    this.updateSlide(sl => ({ ...sl, blocks: mapDeep(sl.blocks.filter(b => !names.includes(b.name)), retrigger(gone, null)) }));
    this.selection.update(sel => sel.filter(n => !gone.has(n)));
  }

  /** Renames a block and the click triggers that point at it. False when the name is empty or taken. */
  renameBlock(old: string, next: string): boolean {
    const s = this.slide();
    next = next.trim();
    if (!s || !next || (next !== old && blockNames(s).includes(next))) return false;
    if (next === old) return true;
    this.updateSlide(sl => ({ ...sl, blocks: mapDeep(sl.blocks, b => retrigger(new Set([old]), next)(b.name === old ? { ...b, name: next } : b)) }));
    this.selection.update(sel => sel.map(n => (n === old ? next : n)));
    return true;
  }

  setAnimation(name: string, on: boolean) {
    this.updateBlocks([name], b => ({ ...b, animation: on ? { effect: 'fade-in', duration: 0.6, delay: 0, on: null } : undefined }));
  }

  /** Blocks whose click can start `name`'s animation: every other block on the slide. */
  triggerOptions(name: string): string[] {
    const s = this.slide();
    return s ? blockNames(s).filter(n => n !== name) : [];
  }

  setFragment(name: string, on: boolean) {
    this.updateBlocks([name], b => ({ ...b, fragment: on ? { index: null, style: '' } : undefined }));
  }

  private restack(backToFront: string[]) {
    const zs = (this.slide()?.blocks ?? []).map(b => b.z).sort((a, b) => a - b);
    const z = new Map(backToFront.map((n, i) => [n, zs[i]]));
    this.updateBlocks(null, b => (z.get(b.name) === b.z ? b : { ...b, z: z.get(b.name)! }));
  }

  /** Where slide `index` of the open list is in the presentation (h, v), or null when it's hidden. */
  revealIndices(index: number): { h: number; v: number } | null {
    const deck = this.deck(), id = this.courseId(), list = this.slides();
    if (!deck || !list[index] || list[index].hidden) return null;
    const visibleBefore = (slides: Slide[], i = slides.length) => slides.slice(0, i).filter(s => !s.hidden).length;
    if (id == null) return { h: visibleBefore(list, index), v: 0 };
    return { h: visibleBefore(deck.intro) + deck.courses.findIndex(c => c.id === id), v: visibleBefore(list, index) };
  }

  private history = new Map<string, { undo: Slide[]; redo: Slide[]; lastKey?: string }>();
  private pending = new Set<string>();
  private timer?: ReturnType<typeof setTimeout>;
  private flushing = Promise.resolve();

  async load() {
    this.deck.set(await this.service.load());
  }

  openCourse(id: string | null) {
    this.courseId.set(id);
    this.openSlide(0);
  }

  openSlide(index: number) {
    this.slideIndex.set(Math.max(0, Math.min(index, this.slides().length - 1)));
    this.selection.set([]);
  }

  /**
   * Changes the current slide. Changes with the same `coalesce` key in a row (typing in one field)
   * share one undo step.
   */
  updateSlide(fn: (s: Slide) => Slide, coalesce?: string) {
    const current = this.slide();
    if (!current) return;
    const h = this.historyOf(current.path);
    if (!coalesce || h.lastKey !== coalesce) {
      h.undo.push(current);
      if (h.undo.length > MAX_HISTORY) h.undo.shift();
    }
    h.lastKey = coalesce;
    h.redo = [];
    this.replace(fn(current));
    this.scheduleSave(current.path);
  }

  setNotes(text: string) {
    this.updateSlide(s => ({ ...s, notes: text }), 'notes');
  }

  undo() {
    this.step('undo', 'redo');
  }

  redo() {
    this.step('redo', 'undo');
  }

  async setAutoAnimate(v: boolean) {
    this.updateSlide(s => ({ ...s, autoAnimate: v }));
  }

  /** Hidden lives in the order file, not in the slide. */
  async setHidden(v: boolean) {
    const current = this.slide();
    if (!current) return;
    this.replace({ ...current, hidden: v });
    await this.saveOrder();
  }

  async addSlide() {
    const list = this.slides(), current = this.slide();
    if (!current) return;
    const dir = folderOf(current.path);
    const taken = new Set(list.map(s => s.path));
    let created: Slide | null = null;
    // A file of that name may exist on disk without being in the deck; creating never overwrites, so try the next.
    for (let n = 1; !created && n < 1000; n++) {
      const path = `${dir}/slide-${n}.html`;
      if (taken.has(path)) continue;
      try {
        created = await this.write(() => this.service.saveSlide({ path, hidden: false, autoAnimate: false, blocks: [], notes: '', etag: '' }));
      } catch (e) {
        if (!(e instanceof ConflictError)) return this.fail(e);
      }
    }
    if (!created) return;
    const at = this.slideIndex() + 1;
    this.setList([...list.slice(0, at), created, ...list.slice(at)]);
    this.openSlide(at);
    await this.saveOrder();
  }

  /** Writes the order without the slide first, then deletes its file, so the deck never lists a missing file. */
  async deleteSlide() {
    const current = this.slide();
    if (!current || this.slides().length < 2) return;
    const before = this.slides(), index = this.slideIndex();
    this.setList(before.filter(s => s.path !== current.path));
    this.openSlide(index);
    if (!(await this.saveOrder())) {
      this.setList(before);
      this.openSlide(index);
      return;
    }
    this.pending.delete(current.path);
    this.history.delete(current.path);
    await this.guard(() => this.service.deleteSlide(current));
  }

  async moveSlide(from: number, to: number) {
    const list = [...this.slides()];
    const current = this.slide();
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    this.setList(list);
    this.slideIndex.set(list.findIndex(s => s.path === current?.path));
    await this.saveOrder();
  }

  /** True while an edit isn't on disk yet. */
  unsaved(): boolean {
    return this.pending.size > 0 || this.status() !== 'saved';
  }

  /**
   * After a conflict: saves what is waiting on other slides, then takes every file as it is on disk.
   * The conflicted slides lose their unsaved edits and undo history; the others keep theirs.
   */
  async reloadConflicts() {
    await this.flushNow();
    if (this.pending.size) return;
    const path = this.slide()?.path, conflicted = this.conflicts();
    await this.load();
    for (const p of conflicted) this.history.delete(p);
    this.conflicts.set([]);
    this.error.set('');
    this.slideIndex.set(Math.max(0, this.slides().findIndex(s => s.path === path)));
  }

  /** Writes waiting edits now (before an export, a reload…). */
  flushNow(): Promise<void> {
    clearTimeout(this.timer);
    // One flush at a time, so a slow save can't race the next one with an old etag.
    this.flushing = this.flushing.then(() => this.flush());
    return this.flushing;
  }

  private step(from: 'undo' | 'redo', to: 'undo' | 'redo') {
    const current = this.slide();
    if (!current) return;
    const h = this.historyOf(current.path);
    const target = h[from].pop();
    if (!target) return;
    h[to].push(current);
    h.lastKey = undefined;
    // The file on disk now has the current etag, whatever the snapshot remembers.
    this.replace({ ...target, etag: current.etag });
    this.scheduleSave(current.path);
  }

  private historyOf(path: string) {
    let h = this.history.get(path);
    if (!h) this.history.set(path, (h = { undo: [], redo: [] }));
    return h;
  }

  /** Puts a new version of a slide (matched by path) into the deck. */
  private replace(next: Slide) {
    this.setListOf(next.path, list => list.map(s => (s.path === next.path ? next : s)));
  }

  private setList(list: Slide[]) {
    const id = this.courseId();
    this.deck.update(d => d && (id == null ? { ...d, intro: list } : { ...d, courses: d.courses.map(c => (c.id === id ? { ...c, slides: list } : c)) }));
  }

  private setListOf(path: string, fn: (list: Slide[]) => Slide[]) {
    this.deck.update(d => {
      if (!d) return d;
      if (d.intro.some(s => s.path === path)) return { ...d, intro: fn(d.intro) };
      return { ...d, courses: d.courses.map(c => (c.slides.some(s => s.path === path) ? { ...c, slides: fn(c.slides) } : c)) };
    });
  }

  private find(path: string): Slide | undefined {
    const d = this.deck();
    return d ? [...d.intro, ...d.courses.flatMap(c => c.slides)].find(s => s.path === path) : undefined;
  }

  private scheduleSave(path: string) {
    if (this.conflicts().includes(path)) return;
    this.pending.add(path);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flushNow(), 500);
  }

  private async flush() {
    let failed = false;
    for (const path of [...this.pending]) {
      this.pending.delete(path);
      const s = this.find(path);
      if (!s || this.conflicts().includes(path)) continue;
      try {
        const saved = await this.write(() => this.service.saveSlide(s));
        // Keep edits made while saving; only the etag comes from the save.
        this.setListOf(path, list => list.map(x => (x.path === path ? { ...x, etag: saved.etag } : x)));
      } catch (e) {
        if (!(e instanceof ConflictError)) this.pending.add(path);
        this.fail(e);
        failed = true;
      }
    }
    if (!failed) this.error.set('');
    // Try again later; the edits stay in memory meanwhile and closing the tab asks first.
    if (this.pending.size) this.timer = setTimeout(() => this.flushNow(), 3000);
  }

  /** Writes the open list's order file; returns false when that failed. */
  private async saveOrder(): Promise<boolean> {
    const deck = this.deck(), id = this.courseId();
    if (!deck) return false;
    const etag = await this.guard(() => this.service.saveOrder(deck, id, this.slides()));
    if (etag == null) return false;
    this.deck.update(d => d && (id == null ? { ...d, etag } : { ...d, courses: d.courses.map(c => (c.id === id ? { ...c, etag } : c)) }));
    return true;
  }

  /** Counts a write in flight while it runs. */
  private async write<T>(fn: () => Promise<T>): Promise<T> {
    this.writing.update(n => n + 1);
    try {
      return await fn();
    } finally {
      this.writing.update(n => n - 1);
    }
  }

  private fail(e: unknown) {
    if (e instanceof ConflictError) this.conflicts.update(c => (c.includes(e.path) ? c : [...c, e.path]));
    else this.error.set(e instanceof Error ? e.message : String(e));
  }

  /** Runs a write; on failure records it and returns undefined. Resolves to null for void writes. */
  private async guard<T>(fn: () => Promise<T>): Promise<T | null | undefined> {
    try {
      const result = (await this.write(fn)) ?? null;
      this.error.set('');
      return result;
    } catch (e) {
      this.fail(e);
      return undefined;
    }
  }
}
