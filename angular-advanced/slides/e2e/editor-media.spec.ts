import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test } from './editor-fixture';

const slideFile = (root: string) => readFileSync(join(root, 'courses/demo/slides/demo.html'), 'utf8');

async function at(page: Page, x: number, y: number): Promise<[number, number]> {
  const box = (await page.getByTestId('canvas').boundingBox())!;
  const k = box.width / 1280;
  return [box.x + x * k, box.y + y * k];
}

test.beforeEach(async ({ page, editor }) => {
  await page.goto(`${editor}/edit/demo/demo.html`);
  await expect(page.getByTestId('canvas')).toBeVisible();
});

test('an uploaded image gets a free name in the course folder and can be cropped', async ({ page, root }) => {
  await page.getByTestId('image-picker').setInputFiles(join(__dirname, 'fixture/courses/demo/slides/images/dot.png'));
  // dot.png is taken, so the upload is stored as dot-2.png.
  await expect.poll(() => slideFile(root)).toContain('src="images/dot-2.png"');
  expect(existsSync(join(root, 'courses/demo/slides/images/dot-2.png'))).toBe(true);
  await expect(page.locator('app-canvas img[src$="images/dot-2.png"]')).toBeVisible();

  await page.getByLabel('Image X').fill('-10');
  await page.getByLabel('Image X').press('Enter');
  await expect.poll(() => slideFile(root)).toMatch(/<img src="images\/dot-2\.png" alt="" style="[^"]*left: -10px/);
});

test('a non-image upload is refused', async ({ page, root }) => {
  await page.getByTestId('image-picker').setInputFiles({ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hi') });
  await expect(page.getByRole('status')).toContainText("isn't a PNG, JPG, GIF or SVG");
  expect(slideFile(root)).not.toContain('data-type="image"');
});

test('a table gets a row from the settings', async ({ page, root }) => {
  await page.getByRole('button', { name: 'Table' }).click();
  await expect.poll(() => (slideFile(root).match(/<tr>/g) ?? []).length).toBe(3);
  await page.getByRole('button', { name: '+ Row' }).click();
  await expect.poll(() => (slideFile(root).match(/<tr>/g) ?? []).length).toBe(4);
});

test('the pen draws a drawing block', async ({ page, root }) => {
  await page.getByRole('button', { name: 'Pen' }).click();
  await page.mouse.move(...await at(page, 200, 500));
  await page.mouse.down();
  for (const [x, y] of [[260, 540], [320, 520], [380, 580], [440, 500]]) await page.mouse.move(...await at(page, x, y), { steps: 3 });
  await page.mouse.up();
  await expect.poll(() => slideFile(root)).toMatch(/data-type="drawing" data-name="drawing-1"[\s\S]*<path fill="none" stroke="#ff0000"/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Pen' })).toHaveAttribute('aria-pressed', 'false');
});
