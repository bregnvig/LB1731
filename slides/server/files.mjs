import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

// The root is the deck folder: deck.json, intro/ and one <course>/slides/ per course.
// Only slide content can be read or written through the API: the deck files, intro slides,
// course slides and their images. Everything else under the root is off limits.
const IMAGE = String.raw`images/[a-z0-9._-]+\.(png|svg|gif|jpe?g)`;
const ALLOWED = new RegExp(
  String.raw`^(deck\.json|intro/([a-z0-9-]+\.html|${IMAGE})|[a-z-]+/slides/(deck\.json|[a-z0-9-]+\.html|${IMAGE}))$`,
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
  const top = await readJson('deck.json');
  const courses = await Promise.all(top.json.courses.map(async id => {
    const course = await readJson(`${id}/slides/deck.json`);
    return { id, title: course.json.title, etag: course.etag, slides: await slideFiles(root, `${id}/slides`, course.json.slides) };
  }));
  return { title: top.json.title, etag: top.etag, slides: await slideFiles(root, 'intro', top.json.slides), courses };
}

/**
 * The deck folder given on the command line, as an absolute path. Relative paths are relative to where
 * the command was typed: npm runs scripts in this folder but keeps that place in INIT_CWD.
 */
export function deckRootArg(arg, usage) {
  if (!arg) {
    console.error(`Usage: ${usage}\n<deck> is the folder that holds deck.json, e.g. ../advanced/courses`);
    process.exit(1);
  }
  const root = resolve(process.env.INIT_CWD ?? process.cwd(), arg);
  if (!existsSync(join(root, 'deck.json'))) {
    console.error(`No deck.json in ${root}`);
    process.exit(1);
  }
  return root;
}
