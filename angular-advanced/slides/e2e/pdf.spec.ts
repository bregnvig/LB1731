import { expect, test } from '@playwright/test';
import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';

const slidesDir = join(__dirname, '..');
const pages = (file: string) => (readFileSync(file, 'latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
const VISIBLE_FIXTURE_SLIDES = 6; // welcome + 5 demo slides; the draft is hidden

test('the script exports every visible slide as one page', async ({}, info) => {
  test.setTimeout(120_000);
  const out = info.outputPath('deck.pdf');
  await promisify(execFile)('node', ['scripts/pdf.mjs', '--root', 'e2e/fixture', '--out', out], { cwd: slidesDir });
  expect(pages(out)).toBe(VISIBLE_FIXTURE_SLIDES);
});

test('print mode shows click-triggered blocks in their end state', async ({ page }) => {
  await page.goto('/present?print-pdf#/1/2'); // the animations slide is current, so its start states apply
  await page.waitForFunction(() => (window as any).printReady);
  await expect(page.locator('[data-name="answer"]')).toHaveCSS('opacity', '1');
});

test('POST /api/pdf exports and returns the file path', async ({ request }) => {
  test.setTimeout(120_000);
  const res = await request.post('/api/pdf');
  expect(res.ok()).toBe(true);
  const { path } = await res.json();
  expect(existsSync(path)).toBe(true);
  expect(pages(path)).toBe(VISIBLE_FIXTURE_SLIDES);
});
