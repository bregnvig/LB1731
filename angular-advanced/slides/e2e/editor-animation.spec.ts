import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from './editor-fixture';

const slideFile = (root: string) => readFileSync(join(root, 'courses/demo/slides/demo.html'), 'utf8');

test('a block set to appear on a click stays hidden in the presentation until that click', async ({ page, editor, root }) => {
  await page.goto(`${editor}/edit/demo/demo.html`);
  await page.getByRole('button', { name: 'Code' }).click();
  await page.getByRole('tab', { name: 'Layers' }).click();
  await page.locator('[data-layer="title"]').click();
  await page.getByRole('tab', { name: 'Motion' }).click();
  await page.getByLabel('Animation').check();
  await page.getByRole('button', { name: 'On click' }).click();
  await expect(page.getByLabel('Clicked block')).toHaveValue('code-1');
  await expect.poll(() => slideFile(root)).toMatch(/data-name="title"[^>]*data-animate="fade-in"[^>]*data-animate-on="code-1"/);

  await page.goto(`${editor}/present#/1/0`);
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  const title = page.locator('section.present:not(.stack) [data-name="title"]');
  await page.waitForTimeout(300);
  await expect(title).toHaveCSS('opacity', '0');
  await page.locator('section.present:not(.stack) [data-name="code-1"]').click();
  await expect(title).toHaveCSS('opacity', '1', { timeout: 2000 });
});

test('fragment settings are written to the file', async ({ page, editor, root }) => {
  await page.goto(`${editor}/edit/demo/demo.html`);
  await page.getByRole('tab', { name: 'Layers' }).click();
  await page.locator('[data-layer="title"]').click();
  await page.getByRole('tab', { name: 'Motion' }).click();
  await page.getByLabel('Fragment', { exact: true }).check();
  await page.getByRole('button', { name: 'Fade down' }).click();
  await page.getByLabel('Fragment step').fill('2');
  await page.getByLabel('Fragment step').press('Enter');
  await expect.poll(() => slideFile(root)).toMatch(/class="block fragment fade-down"[^>]*data-name="title"[^>]*data-fragment-index="2"/);
});
