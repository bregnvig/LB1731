// Exports a deck as a folder that opens from index.html with no server, as students get it:
// the presentation from this tool, the deck and its images. No editor, no presenter view.
// Usage: node scripts/export.mjs <deck folder> --out <dir>
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { deckRootArg, loadDeck } from '../server/files.mjs';

const slidesDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(slidesDir, 'dist/slides/browser');

/** Every file under an images/ folder of the deck, relative to the deck folder. */
function imageFiles(root, dir = root) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const path = join(dir, e.name);
    if (e.isDirectory()) return imageFiles(root, path);
    return relative(root, path).split('/').includes('images') ? [relative(root, path)] : [];
  });
}

/** The SVG markup for image blocks marked data-inline-svg, keyed by the src the player renders. */
function inlineSvgs(root, deck) {
  const svgs = {};
  const slides = [...deck.slides, ...deck.courses.flatMap(c => c.slides)];
  for (const { path, html } of slides) {
    const folder = path.slice(0, path.lastIndexOf('/'));
    for (const [, src] of html.matchAll(/data-inline-svg[^>]*>\s*<img[^>]*\ssrc="([^"]+\.svg)"/g)) {
      const file = join(root, folder, src);
      if (existsSync(file)) svgs[`content/${folder}/${src}`] = readFileSync(file, 'utf8');
    }
  }
  return svgs;
}

/** Writes the exported deck to `out` (replacing it) and returns `out`. Uses the app build in dist/. */
export async function exportDeck({ root, out }) {
  if (!existsSync(dist)) spawnSync('npx', ['ng', 'build'], { cwd: slidesDir, stdio: 'inherit' });
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  // Styles, fonts and the favicon as built.
  for (const f of readdirSync(dist)) {
    if (!f.endsWith('.js') && f !== 'index.html') cpSync(join(dist, f), join(out, f), { recursive: true });
  }

  // A page opened from disk can't load module scripts: the app and its lazy chunks become one classic script.
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const main = html.match(/<script src="(main-[^"]+\.js)" type="module"><\/script>/)?.[1];
  if (!main) throw new Error(`No main script in ${join(dist, 'index.html')}`);
  const { outputFiles } = await build({ entryPoints: [join(dist, main)], bundle: true, format: 'iife', minify: true, write: false, logLevel: 'warning' });
  writeFileSync(join(out, 'app.js'), outputFiles[0].text);

  // The deck itself and the SVGs the player inlines, read by src/app/deck/static-export.ts.
  const deck = await loadDeck(root);
  const data = JSON.stringify({ deck, svgs: inlineSvgs(root, deck) }).replace(/</g, '\\u003c');
  writeFileSync(join(out, 'deck.js'), `window.__SLIDES_EXPORT__ = ${data};\n`);
  for (const file of imageFiles(root)) {
    mkdirSync(dirname(join(out, 'content', file)), { recursive: true });
    cpSync(join(root, file), join(out, 'content', file));
  }

  const title = deck.title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  writeFileSync(join(out, 'index.html'), html
    .replace(/<link rel="modulepreload"[^>]*>/g, '')
    .replace(/<script src="main-[^"]+\.js" type="module"><\/script>/, '')
    // The router isn't used, and a base href would point the page's URLs away from index.html.
    .replace(/<base href="[^"]*">\s*/, '')
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace('<app-root></app-root>', '<app-present></app-present>')
    .replace('</body>', '<script src="deck.js"></script>\n<script src="app.js"></script>\n</body>'));
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values, positionals } = parseArgs({ options: { out: { type: 'string' } }, allowPositionals: true });
  const root = deckRootArg(positionals[0], 'node scripts/export.mjs <deck> --out <dir>');
  if (!values.out) {
    console.error('Usage: node scripts/export.mjs <deck> --out <dir>');
    process.exit(1);
  }
  console.log(await exportDeck({ root, out: resolve(process.env.INIT_CWD ?? process.cwd(), values.out) }));
}
