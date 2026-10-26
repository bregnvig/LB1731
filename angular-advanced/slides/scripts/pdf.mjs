// Exports the deck to PDF for students: one page per visible slide, every fragment and animation shown.
// Usage: node scripts/pdf.mjs [--out <file>] [--root <angular-advanced dir>]
import { chromium } from '@playwright/test';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createServer } from '../server/server.mjs';

const slidesDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(slidesDir, 'dist/slides/browser');

/** Writes the PDF and returns its path. Uses the server at `url`, or starts one on a free port. */
export async function exportPdf({ root, out = join(slidesDir, 'out', `${basename(root)}.pdf`), url }) {
  if (!existsSync(dist)) spawnSync('npx', ['ng', 'build'], { cwd: slidesDir, stdio: 'inherit' });
  let server;
  if (!url) {
    server = createServer({ root, dist });
    await new Promise(ok => server.listen(0, ok));
    url = `http://localhost:${server.address().port}`;
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
  const { values } = parseArgs({ options: { out: { type: 'string' }, root: { type: 'string', default: join(slidesDir, '..') } } });
  console.log(await exportPdf({ root: resolve(values.root), out: values.out && resolve(values.out) }));
}
