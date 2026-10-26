import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConflictError, DeckService } from '../deck/deck.service';
import { Deck, Slide } from '../deck/model';
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
});
