import { Injectable, signal } from '@angular/core';
import { Deck, Slide, SlideFile } from './model';
import { parseSlide, serializeSlide } from './slide-format';

/** The file changed on disk since it was loaded (an LLM, git or another window edited it). */
export class ConflictError extends Error {
  constructor(readonly path: string) {
    super(`${path} changed on disk`);
  }
}

interface DeckJson { title: string; slides: SlideFile[]; courses: { id: string; title: string; slides: SlideFile[] }[] }

const fileName = (path: string) => path.slice(path.lastIndexOf('/') + 1);
const folder = (path: string) => path.slice(0, path.lastIndexOf('/'));

@Injectable({ providedIn: 'root' })
export class DeckService {
  readonly deck = signal<Deck | null>(null);

  async load(): Promise<Deck> {
    const res = await fetch('/api/deck');
    if (!res.ok) throw new Error(`Loading the deck failed: ${res.status} ${await res.text()}`);
    const json: DeckJson = await res.json();
    const deck: Deck = {
      title: json.title,
      intro: json.slides.map(parseSlide),
      courses: json.courses.map(c => ({ id: c.id, title: c.title, slides: c.slides.map(parseSlide) })),
    };
    this.deck.set(deck);
    return deck;
  }

  async saveSlide(slide: Slide): Promise<Slide> {
    const res = await fetch(`/api/files/${slide.path}`, {
      method: 'PUT', body: serializeSlide(slide), headers: slide.etag ? { 'If-Match': slide.etag } : {},
    });
    if (res.status === 409) throw new ConflictError(slide.path);
    if (!res.ok) throw new Error(`Saving ${slide.path} failed: ${res.status}`);
    return { ...slide, etag: res.headers.get('ETag') ?? '' };
  }

  /** Writes the order file of a course, or of the intro when courseId is null. */
  async saveOrder(courseId: string | null, slides: Slide[]): Promise<void> {
    const deck = this.deck();
    if (!deck) throw new Error('Deck not loaded');
    const entries = slides.map(s => (s.hidden ? { file: fileName(s.path), hidden: true } : { file: fileName(s.path) }));
    const [path, json] = courseId == null
      ? ['slides/deck.json', { title: deck.title, slides: entries, courses: deck.courses.map(c => c.id) }]
      : [`courses/${courseId}/slides/deck.json`, { title: deck.courses.find(c => c.id === courseId)?.title ?? courseId, slides: entries }];
    const res = await fetch(`/api/files/${path}`, { method: 'PUT', body: `${JSON.stringify(json, null, 2)}\n` });
    if (!res.ok) throw new Error(`Saving ${path} failed: ${res.status}`);
  }

  async deleteSlide(slide: Slide): Promise<void> {
    const res = await fetch(`/api/files/${slide.path}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 404) throw new Error(`Deleting ${slide.path} failed: ${res.status}`);
  }

  /** Stores an image next to the slides in `dir` (a slide folder) and returns its path relative to that folder. */
  async uploadImage(dir: string, file: File): Promise<string> {
    const rel = `images/${file.name}`;
    const res = await fetch(`/api/files/${dir}/${rel}`, { method: 'PUT', body: file });
    if (!res.ok) throw new Error(`Uploading ${file.name} failed: ${res.status}`);
    return rel;
  }
}

export { folder as slideFolderOf };
