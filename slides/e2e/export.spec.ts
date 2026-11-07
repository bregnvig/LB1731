import { expect, test } from '@playwright/test';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const slidesDir = join(__dirname, '..');
const VISIBLE_FIXTURE_SLIDES = 6; // welcome + 5 demo slides; the draft is hidden

test('an exported deck runs from index.html with no server', async ({ page }, info) => {
  test.setTimeout(120_000);
  const out = info.outputPath('deck');
  await promisify(execFile)('node', ['scripts/export.mjs', join(__dirname, 'fixture'), '--out', out], { cwd: slidesDir });
  expect(existsSync(join(out, 'index.html'))).toBe(true);

  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  const index = pathToFileURL(join(out, 'index.html')).href;

  await page.goto(index);
  await page.waitForFunction(() => (window as any).Reveal?.isReady());
  expect(await page.evaluate(() => (window as any).Reveal.getTotalSlides())).toBe(VISIBLE_FIXTURE_SLIDES);
  await expect(page.locator('.reveal img').first()).toHaveJSProperty('complete', true);

  // reveal.js owns the hash: a deep link opens that slide.
  await page.goto(`${index}#/1/1`);
  await page.reload();
  await page.waitForFunction(() => (window as any).Reveal?.isReady());
  expect(await page.evaluate(() => (window as any).Reveal.getIndices())).toMatchObject({ h: 1, v: 1 });

  expect(errors).toEqual([]);
});
