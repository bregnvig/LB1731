import { Injectable, computed, inject, signal } from '@angular/core';
import { ConflictError, DeckService } from '../deck/deck.service';
import { Block, Deck, Slide } from '../deck/model';
import { blockNames } from '../deck/slide-format';
import { safeImageName, uniqueImageName } from './media';

export type SaveStatus = 'saved' | 'saving' | 'conflict' | 'error';

const MAX_HISTORY = 100;
const folderOf = (path: string) => path.slice(0, path.lastIndexOf('/'));

/**
 * The editor's state. Slide edits go through `updateSlide`, which records undo history per slide
 * and writes the file 500 ms after the last change. A file changed on disk by someone else stops
 * saving until the slide is reloaded.
 */
@Injectable({ providedIn: 'root' })
export class EditorStore {
  private readonly service = inject(DeckService);

  readonly deck = signal<Deck | null>(null);
  /** null is the intro. */
  readonly courseId = signal<string | null>(null);
  readonly slideIndex = signal(0);
  readonly selection = signal<string[]>([]);
  readonly status = signal<SaveStatus>('saved');
  readonly error = signal('');
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

  deleteBlocks(names: string[]) {
    const gone = new Set(names);
    this.updateSlide(s => ({
      ...s,
      blocks: s.blocks.filter(b => !gone.has(b.name))
        .map(b => (b.animation?.on && gone.has(b.animation.on) ? { ...b, animation: { ...b.animation, on: null } } : b)),
    }));
    this.selection.update(sel => sel.filter(n => !gone.has(n)));
  }

  /** Renames a block and the click triggers that point at it. False when the name is empty or taken. */
  renameBlock(old: string, next: string): boolean {
    const s = this.slide();
    next = next.trim();
    if (!s || !next || (next !== old && blockNames(s).includes(next))) return false;
    if (next === old) return true;
    this.updateBlocks(null, b => {
      const renamed = b.name === old ? { ...b, name: next } : b;
      return renamed.animation?.on === old ? { ...renamed, animation: { ...renamed.animation, on: next } } : renamed;
    });
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
    let n = 1;
    while (taken.has(`${dir}/slide-${n}.html`)) n++;
    const created = await this.guard(() => this.service.saveSlide({ path: `${dir}/slide-${n}.html`, hidden: false, autoAnimate: false, blocks: [], notes: '', etag: '' }));
    if (!created) return;
    const at = this.slideIndex() + 1;
    this.setList([...list.slice(0, at), created, ...list.slice(at)]);
    this.openSlide(at);
    await this.saveOrder();
  }

  async deleteSlide() {
    const current = this.slide();
    if (!current || this.slides().length < 2) return;
    this.pending.delete(current.path);
    if ((await this.guard(() => this.service.deleteSlide(current))) === undefined) return;
    this.setList(this.slides().filter(s => s !== current));
    this.history.delete(current.path);
    this.openSlide(this.slideIndex());
    await this.saveOrder();
  }

  async moveSlide(from: number, to: number) {
    const list = [...this.slides()];
    const current = this.slide();
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    this.setList(list);
    this.slideIndex.set(list.indexOf(current!));
    await this.saveOrder();
  }

  /** After a conflict: take the files as they are on disk now. */
  async reloadSlide() {
    const path = this.slide()?.path;
    clearTimeout(this.timer);
    this.pending.clear();
    this.history.clear();
    await this.load();
    const index = this.slides().findIndex(s => s.path === path);
    this.slideIndex.set(Math.max(0, index));
    this.status.set('saved');
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
    if (this.status() === 'conflict') return;
    this.pending.add(path);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 500);
  }

  private async flush() {
    for (const path of [...this.pending]) {
      this.pending.delete(path);
      const s = this.find(path);
      if (!s) continue;
      this.status.set('saving');
      const saved = await this.guard(() => this.service.saveSlide(s));
      if (!saved) return;
      // Keep edits made while saving; only the etag comes from the save.
      this.setListOf(path, list => list.map(x => (x.path === path ? { ...x, etag: saved.etag } : x)));
    }
    if (this.status() === 'saving') this.status.set('saved');
  }

  private async saveOrder() {
    await this.guard(() => this.service.saveOrder(this.courseId(), this.slides()));
  }

  /** Runs a write; on failure sets the status and returns undefined. Resolves to null for void writes. */
  private async guard<T>(write: () => Promise<T>): Promise<T | null | undefined> {
    try {
      return (await write()) ?? null;
    } catch (e) {
      this.status.set(e instanceof ConflictError ? 'conflict' : 'error');
      this.error.set(e instanceof Error ? e.message : String(e));
      return undefined;
    }
  }
}
