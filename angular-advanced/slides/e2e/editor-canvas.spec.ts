import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test } from './editor-fixture';

const file = (root: string) => join(root, 'courses/demo/slides/shapes.html');
const blockTag = (root: string, name: string) => readFileSync(file(root), 'utf8').split('\n').find(l => l.includes(`data-name="${name}"`)) ?? '';
const styleNumber = (tag: string, prop: string) => Number(new RegExp(`${prop}:(-?[\\d.]+)px`).exec(tag)?.[1]);

/** Page coordinates of a point on the 1280×720 slide. */
async function at(page: Page, x: number, y: number) {
  const box = (await page.getByTestId('canvas').boundingBox())!;
  const k = box.width / 1280;
  return { x: box.x + x * k, y: box.y + y * k };
}

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 4 });
  await page.mouse.move(to.x, to.y, { steps: 4 });
  await page.mouse.up();
}

test.beforeEach(async ({ page, editor }) => {
  await page.goto(`${editor}/edit/demo/shapes.html`);
  await expect(page.getByTestId('canvas')).toBeVisible();
});

test('dragging a block moves it in the file', async ({ page, root }) => {
  await drag(page, await at(page, 200, 160), await at(page, 300, 160));
  await expect.poll(() => styleNumber(blockTag(root, 'shape-1'), 'left')).toBeGreaterThanOrEqual(195);
  expect(styleNumber(blockTag(root, 'shape-1'), 'left')).toBeLessThanOrEqual(205);
  expect(styleNumber(blockTag(root, 'shape-1'), 'top')).toBe(100);
});

test('a resize handle changes the size and shows it', async ({ page, root }) => {
  await page.mouse.click(...Object.values(await at(page, 200, 160)) as [number, number]);
  await expect(page.getByTestId('size')).toHaveText('200 × 120');
  await drag(page, await at(page, 300, 220), await at(page, 360, 250));
  await expect.poll(() => styleNumber(blockTag(root, 'shape-1'), 'width')).toBe(260);
  expect(styleNumber(blockTag(root, 'shape-1'), 'height')).toBe(150);
});

test('dragging a line end moves that end', async ({ page, root }) => {
  await page.getByRole('tab', { name: 'Layers' }).click();
  await page.locator('[data-layer="arrow-1"]').click();
  await drag(page, await at(page, 600, 160), await at(page, 600, 300));
  await expect.poll(() => blockTag(root, 'arrow-1')).toContain('data-y2="140"');
  expect(blockTag(root, 'arrow-1')).toContain('data-x2="200"');
});

test('arrow keys nudge, Delete removes, undo brings it back', async ({ page, root }) => {
  await page.mouse.click(...Object.values(await at(page, 200, 160)) as [number, number]);
  await page.keyboard.press('Shift+ArrowRight');
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => styleNumber(blockTag(root, 'shape-1'), 'left')).toBe(110);
  expect(styleNumber(blockTag(root, 'shape-1'), 'top')).toBe(101);
  await page.keyboard.press('Delete');
  await expect.poll(() => blockTag(root, 'shape-1')).toBe('');
  await page.keyboard.press('Control+z');
  await expect.poll(() => blockTag(root, 'shape-1')).toContain('left:110px');
});

test('a marquee selects the blocks it touches', async ({ page }) => {
  await drag(page, await at(page, 50, 50), await at(page, 650, 400));
  await expect(page.locator('app-editor .kind')).toHaveText('2 blocks');
});
