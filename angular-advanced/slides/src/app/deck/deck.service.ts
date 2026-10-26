import { Injectable } from '@angular/core';
import { Deck, Slide, SlideFile } from './model';
import { parseSlide, serializeSlide } from './slide-format';

/** The file changed on disk since it was loaded (an LLM, git or another window edited it). */
export class ConflictError extends Error {
  constructor(readonly path: string) {
    super(`${path} changed on disk`);
  }
}

interface DeckJson { title: string; etag: string; slides: SlideFile[]; courses: { id: string; title: string; etag: string; slides: SlideFile[] }[] }

const fileName = (path: string) => path.slice(path.lastIndexOf('/') + 1);
const folder = (path: string) => path.slice(0, path.lastIndexOf('/'));

@Injectable({ providedIn: 'root' })
export class DeckService {
  async load(): Promise<Deck> {
    const res = await fetch('/api/deck');
    if (!res.ok) throw new Error(`Loading the deck failed: ${res.status} ${await res.text()}`);
    const json: DeckJson = await res.json();
    return {
      title: json.title,
      etag: json.etag,
      intro: json.slides.map(parseSlide),
      courses: json.courses.map(c => ({ id: c.id, title: c.title, etag: c.etag, slides: c.slides.map(parseSlide) })),
    };
  }

  async saveSlide(slide: Slide): Promise<Slide> {
    const res = await fetch(`/api/files/${slide.path}`, {
      // No etag means a new file: create it, but never over one that is already there.
      method: 'PUT', body: serializeSlide(slide), headers: slide.etag ? { 'If-Match': slide.etag } : { 'If-None-Match': '*' },
    });
    if (res.status === 409) throw new ConflictError(slide.path);
    if (!res.ok) throw new Error(`Saving ${slide.path} failed: ${res.status}`);
    return { ...slide, etag: res.headers.get('ETag') ?? '' };
  }

  /**
   * Writes the order file of a course, or of the intro when courseId is null, if it hasn't changed on
   * disk since it was loaded. Returns its new etag.
   */
  async saveOrder(deck: Deck, courseId: string | null, slides: Slide[]): Promise<string> {
    const entries = slides.map(s => (s.hidden ? { file: fileName(s.path), hidden: true } : { file: fileName(s.path) }));
    const [path, json] = courseId == null
      ? ['slides/deck.json', { title: deck.title, slides: entries, courses: deck.courses.map(c => c.id) }]
      : [`courses/${courseId}/slides/deck.json`, { title: deck.courses.find(c => c.id === courseId)?.title ?? courseId, slides: entries }];
    const etag = courseId == null ? deck.etag : deck.courses.find(c => c.id === courseId)?.etag;
    const res = await fetch(`/api/files/${path}`, { method: 'PUT', body: `${JSON.stringify(json, null, 2)}\n`, headers: etag ? { 'If-Match': etag } : {} });
    if (res.status === 409) throw new ConflictError(path);
    if (!res.ok) throw new Error(`Saving ${path} failed: ${res.status}`);
    return res.headers.get('ETag') ?? '';
  }

  async deleteSlide(slide: Slide): Promise<void> {
    const res = await fetch(`/api/files/${slide.path}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 404) throw new Error(`Deleting ${slide.path} failed: ${res.status}`);
  }

  /** Stores an image as `images/<name>` next to the slides in `dir` (a slide folder) and returns that relative path. */
  async uploadImage(dir: string, file: Blob, name: string): Promise<string> {
    const rel = `images/${name}`;
    const res = await fetch(`/api/files/${dir}/${rel}`, { method: 'PUT', body: file });
    if (!res.ok) throw new Error(`Uploading ${name} failed: ${res.status}`);
    return rel;
  }

  async imageExists(dir: string, name: string): Promise<boolean> {
    return (await fetch(`/api/files/${dir}/images/${name}`)).ok;
  }
}

export { folder as slideFolderOf };
