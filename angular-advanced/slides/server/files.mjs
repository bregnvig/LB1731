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

export async function loadDeck(root) {
  const readJson = async p => JSON.parse(await readFile(join(root, p), 'utf8'));
  const top = await readJson('slides/deck.json');
  const courses = await Promise.all(top.courses.map(async id => {
    const course = await readJson(`courses/${id}/slides/deck.json`);
    return { id, title: course.title, slides: await slideFiles(root, `courses/${id}/slides`, course.slides) };
  }));
  return { title: top.title, slides: await slideFiles(root, 'slides/intro', top.slides), courses };
}
