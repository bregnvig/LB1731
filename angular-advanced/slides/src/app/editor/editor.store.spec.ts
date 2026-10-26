import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictError, DeckService } from '../deck/deck.service';
import { Block, Deck, Slide } from '../deck/model';
import { serializeSlide } from '../deck/slide-format';
import { EditorStore } from './editor.store';

const slide = (path: string, extra: Partial<Slide> = {}): Slide =>
  ({ path, hidden: false, autoAnimate: false, blocks: [], notes: '', etag: 'e0', ...extra });

function setup() {
  const deck: Deck = {
    title: 'T',
    intro: [slide('slides/intro/welcome.html')],
    courses: [{ id: 'demo', title: 'Demo', slides: [slide('courses/demo/slides/a.html'), slide('courses/demo/slides/b.html'), slide('courses/demo/slides/c.html')] }],
  };
  let n = 0;
  const service = {
    load: vi.fn(async () => structuredClone(deck)),
    saveSlide: vi.fn(async (s: Slide) => ({ ...s, etag: `e${++n}` })),
    saveOrder: vi.fn(async (_id: string | null, _slides: Slide[]) => {}),
    deleteSlide: vi.fn(async () => {}),
  };
  TestBed.configureTestingModule({ providers: [{ provide: DeckService, useValue: service }] });
  return { store: TestBed.inject(EditorStore), service };
}

describe('EditorStore', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  async function opened() {
    const s = setup();
    await s.store.load();
    s.store.openCourse('demo');
    return s;
  }

  it('undoes and redoes a change', async () => {
    const { store } = await opened();
    store.updateSlide(s => ({ ...s, notes: 'one' }));
    store.updateSlide(s => ({ ...s, notes: 'two' }));
    store.undo();
    expect(store.slide()!.notes).toBe('one');
    store.redo();
    expect(store.slide()!.notes).toBe('two');
  });

  it('saves once, 500 ms after quick changes, and keeps the new etag', async () => {
    const { store, service } = await opened();
    store.updateSlide(s => ({ ...s, notes: 'a' }));
    store.updateSlide(s => ({ ...s, notes: 'ab' }));
    await vi.advanceTimersByTimeAsync(499);
    expect(service.saveSlide).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(service.saveSlide).toHaveBeenCalledTimes(1);
    expect(service.saveSlide.mock.calls[0][0].notes).toBe('ab');
    expect(store.status()).toBe('saved');
    expect(store.slide()!.etag).toBe('e1');
  });

  it('undo keeps the latest etag so the save is not a false conflict', async () => {
    const { store, service } = await opened();
    store.updateSlide(s => ({ ...s, notes: 'a' }));
    await vi.advanceTimersByTimeAsync(500);
    store.undo();
    await vi.advanceTimersByTimeAsync(500);
    expect(service.saveSlide.mock.calls[1][0].etag).toBe('e1');
  });

  it('stops saving after a conflict until the slide is reloaded', async () => {
    const { store, service } = await opened();
    service.saveSlide.mockRejectedValueOnce(new ConflictError('courses/demo/slides/a.html'));
    store.updateSlide(s => ({ ...s, notes: 'a' }));
    await vi.advanceTimersByTimeAsync(500);
    expect(store.status()).toBe('conflict');
    store.updateSlide(s => ({ ...s, notes: 'b' }));
    await vi.advanceTimersByTimeAsync(1000);
    expect(service.saveSlide).toHaveBeenCalledTimes(1);
    await store.reloadSlide();
    expect(store.status()).toBe('saved');
    expect(store.slide()!.notes).toBe('');
  });

  it('moves a slide and saves the new order', async () => {
    const { store, service } = await opened();
    await store.moveSlide(0, 2);
    expect(service.saveOrder).toHaveBeenCalledWith('demo', [
      expect.objectContaining({ path: 'courses/demo/slides/b.html' }),
      expect.objectContaining({ path: 'courses/demo/slides/c.html' }),
      expect.objectContaining({ path: 'courses/demo/slides/a.html' }),
    ]);
    expect(store.slide()!.path).toBe('courses/demo/slides/a.html');
  });

  it('adds an empty slide after the current one and opens it', async () => {
    const { store, service } = await opened();
    await store.addSlide();
    expect(store.slides().map(s => s.path)).toEqual([
      'courses/demo/slides/a.html', 'courses/demo/slides/slide-1.html', 'courses/demo/slides/b.html', 'courses/demo/slides/c.html',
    ]);
    expect(store.slideIndex()).toBe(1);
    expect(service.saveSlide).toHaveBeenCalledWith(expect.objectContaining({ path: 'courses/demo/slides/slide-1.html', etag: '' }));
    expect(service.saveOrder).toHaveBeenCalled();
  });

  it('hides a slide through the order file', async () => {
    const { store, service } = await opened();
    await store.setHidden(true);
    expect(store.slide()!.hidden).toBe(true);
    expect(service.saveOrder.mock.calls[0][1][0].hidden).toBe(true);
    expect(service.saveSlide).not.toHaveBeenCalled();
  });

  it('deletes the current slide', async () => {
    const { store, service } = await opened();
    store.openSlide(2);
    await store.deleteSlide();
    expect(service.deleteSlide).toHaveBeenCalledWith(expect.objectContaining({ path: 'courses/demo/slides/c.html' }));
    expect(store.slides().length).toBe(2);
    expect(store.slideIndex()).toBe(1);
  });

  describe('blocks', () => {
    const text = (name: string, extra: Partial<Block> = {}) =>
      ({ type: 'text', name, x: 100, y: 100, width: 200, height: 'auto', z: 1, html: '<p>t</p>', ...extra }) as Block;

    async function withBlocks(blocks: Block[]) {
      const s = await opened();
      s.store.updateSlide(sl => ({ ...sl, blocks }));
      return s;
    }
    const block = (store: EditorStore, name: string) => store.slide()!.blocks.find(b => b.name === name)!;

    it('moves selected blocks but not locked ones', async () => {
      const { store } = await withBlocks([text('a'), text('b', { locked: true })]);
      store.moveBlocks(['a', 'b'], 10, -5);
      expect([block(store, 'a').x, block(store, 'a').y]).toEqual([110, 95]);
      expect(block(store, 'b').x).toBe(100);
    });

    it('renaming updates click triggers that point at the block', async () => {
      const { store } = await withBlocks([text('q'), text('a', { animation: { effect: 'fade-in', duration: 0.6, delay: 0, on: 'q' } })]);
      expect(store.renameBlock('q', 'question')).toBe(true);
      expect(block(store, 'a').animation!.on).toBe('question');
      expect(store.renameBlock('a', 'question')).toBe(false);
    });

    it('deleting a block turns animations it triggered into entry animations', async () => {
      const { store } = await withBlocks([text('q'), text('a', { animation: { effect: 'fade-in', duration: 0.6, delay: 0, on: 'q' } })]);
      store.select(['q']);
      store.deleteBlocks(['q']);
      expect(store.slide()!.blocks.map(b => b.name)).toEqual(['a']);
      expect(block(store, 'a').animation!.on).toBeNull();
      expect(store.selection()).toEqual([]);
    });

    it('brings a block to the front by reusing the existing depths', async () => {
      const { store } = await withBlocks([text('a', { z: 10 }), text('b', { z: 11 }), text('c', { z: 12 })]);
      store.setDepth(['a'], 'front');
      expect(['a', 'b', 'c'].map(n => block(store, n).z)).toEqual([12, 10, 11]);
      store.setDepth(['a'], 'backward');
      expect(['a', 'b', 'c'].map(n => block(store, n).z)).toEqual([11, 10, 12]);
    });

    it('duplicates with a free name, offset and on top', async () => {
      const { store } = await withBlocks([text('a', { z: 3 }), text('a-copy', { z: 4 })]);
      store.duplicate(['a']);
      const copy = block(store, 'a-copy-2');
      expect([copy.x, copy.y, copy.z]).toEqual([120, 120, 5]);
      expect(store.selection()).toEqual(['a-copy-2']);
    });

    it('turns an animation on with the defaults and off again', async () => {
      const { store } = await withBlocks([text('a')]);
      store.setAnimation('a', true);
      expect(block(store, 'a').animation).toEqual({ effect: 'fade-in', duration: 0.6, delay: 0, on: null });
      store.setAnimation('a', false);
      expect(block(store, 'a').animation).toBeUndefined();
    });

    it('offers every other block as a click trigger', async () => {
      const { store } = await withBlocks([text('a'), text('b'), text('c')]);
      expect(store.triggerOptions('b')).toEqual(['a', 'c']);
    });

    it('a fragment shows up as the fragment class in the file', async () => {
      const { store } = await withBlocks([text('a')]);
      store.setFragment('a', true);
      expect(serializeSlide(store.slide()!)).toContain('class="block fragment"');
      store.setFragment('a', false);
      expect(serializeSlide(store.slide()!)).not.toContain('fragment');
    });

    it('resizes and selects additively', async () => {
      const { store } = await withBlocks([text('a'), text('b')]);
      store.resizeBlock('a', { x: 5, y: 6, width: 300, height: 40 });
      expect(block(store, 'a')).toMatchObject({ x: 5, y: 6, width: 300, height: 40 });
      store.select(['a']);
      store.select(['b'], true);
      expect(store.selection()).toEqual(['a', 'b']);
      store.select(['a'], true);
      expect(store.selection()).toEqual(['b']);
    });
  });
});
