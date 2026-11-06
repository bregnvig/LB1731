// Exports the deck to PDF for students: one page per visible slide, every fragment and animation shown.
// Usage: node scripts/pdf.mjs <deck folder> [--out <file>]  (default out/<deck title>.pdf)
import { chromium } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createServer } from '../server/server.mjs';
import { deckRootArg } from '../server/files.mjs';

const slidesDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(slidesDir, 'dist/slides/browser');

/** "Angular Advanced" -> out/angular-advanced.pdf */
async function defaultOut(root) {
  const { title } = JSON.parse(await readFile(join(root, 'deck.json'), 'utf8'));
  return join(slidesDir, 'out', `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'slides'}.pdf`);
}

/** Writes the PDF and returns its path. Uses the server at `url`, or starts one on a free port. */
export async function exportPdf({ root, out, url }) {
  out ??= await defaultOut(root);
  if (!existsSync(dist)) spawnSync('npx', ['ng', 'build'], { cwd: slidesDir, stdio: 'inherit' });
  let server;
  if (!url) {
    server = createServer({ root, dist });
    await new Promise(ok => server.listen(0, '127.0.0.1', ok));
    url = `http://127.0.0.1:${server.address().port}`;
  }
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`${url}/present?print-pdf`);
    await page.waitForFunction(() => window.printReady, null, { timeout: 60_000 });
    await mkdir(dirname(out), { recursive: true });
    await page.pdf({ path: out, width: '1280px', height: '720px', printBackground: true });
    return out;
  } finally {
    await browser.close();
    server?.close();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { out: { type: 'string' } } });
  const root = deckRootArg(positionals[0], 'npm run pdf -- <deck> [--out <file>]');
  console.log(await exportPdf({ root, out: values.out && resolve(process.env.INIT_CWD ?? process.cwd(), values.out) }));
}
