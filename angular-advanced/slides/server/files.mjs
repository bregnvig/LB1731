import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

// Only slide content can be read or written through the API: the deck files, intro slides,
// course slides and their images. Everything else under the root is off limits.
const IMAGE = String.raw`images/[a-z0-9._-]+\.(png|svg|gif|jpe?g)`;
const ALLOWED = new RegExp(
  String.raw`^(slides/(deck\.json|intro/([a-z0-9-]+\.html|${IMAGE}))|courses/[a-z-]+/slides/(deck\.json|[a-z0-9-]+\.html|${IMAGE}))$`,
);

export function isAllowedPath(rel) {
  return !rel.includes('..') && !rel.includes('\\') && ALLOWED.test(rel);
}

export function etagOf(buf) {
  return createHash('sha1').update(buf).digest('hex');
}

async function slideFiles(root, dir, entries) {
  return Promise.all(entries.map(async ({ file, hidden }) => {
    const path = `${dir}/${file}`;
    const buf = await readFile(join(root, path));
    return { path, hidden: !!hidden, html: buf.toString('utf8'), etag: etagOf(buf) };
  }));
}

/** The deck for the app. `etag` is each order file's, so the editor can tell when one changed on disk. */
export async function loadDeck(root) {
  const readJson = async p => {
    const buf = await readFile(join(root, p));
    return { json: JSON.parse(buf.toString('utf8')), etag: etagOf(buf) };
  };
  const top = await readJson('slides/deck.json');
  const courses = await Promise.all(top.json.courses.map(async id => {
    const course = await readJson(`courses/${id}/slides/deck.json`);
    return { id, title: course.json.title, etag: course.etag, slides: await slideFiles(root, `courses/${id}/slides`, course.json.slides) };
  }));
  return { title: top.json.title, etag: top.etag, slides: await slideFiles(root, 'slides/intro', top.json.slides), courses };
}
