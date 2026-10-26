import { readFileSync } from 'node:fs';
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

test('a new code block with highlighted lines is written to the file', async ({ page, root }) => {
  await page.getByRole('button', { name: 'Code' }).click();
  await page.getByLabel('Code', { exact: true }).fill('const a = 1;\nconst b = 2;');
  await page.getByLabel('Line numbers').check();
  await page.getByLabel('Highlight lines').fill('2');
  await page.getByLabel('Highlight lines').press('Enter');
  await expect.poll(() => slideFile(root)).toContain('data-line-numbers="2"');
  expect(slideFile(root)).toContain('data-name="code-1"');
  expect(slideFile(root)).toContain('const b = 2;');
});

test('a bad highlighted-lines value is refused with a message', async ({ page, root }) => {
  await page.getByRole('button', { name: 'Code' }).click();
  await page.getByLabel('Line numbers').check();
  await expect.poll(() => slideFile(root)).toContain('data-line-numbers=""');
  await page.getByLabel('Highlight lines').fill('two');
  await page.getByLabel('Highlight lines').press('Enter');
  await expect(page.getByText('Use line numbers and ranges')).toBeVisible();
  await page.waitForTimeout(700);
  expect(slideFile(root)).toContain('data-line-numbers=""');
});

test('text is edited on the canvas: heading level and color', async ({ page, root }) => {
  await page.mouse.dblclick(...await at(page, 640, 330));
  await page.getByRole('toolbar', { name: 'Text formatting' }).getByRole('button', { name: 'H2' }).click();
  await page.getByLabel('Selection color').fill('#e7ad52');
  await page.mouse.click(...await at(page, 640, 650));
  await expect.poll(() => slideFile(root)).toContain('<h2');
  expect(slideFile(root)).toMatch(/color: (rgb\(231, 173, 82\)|#e7ad52)/);
  expect(slideFile(root)).not.toContain('<h1');
});

test('shape, line and common settings change the file', async ({ page, root }) => {
  await page.getByRole('button', { name: 'Shape' }).click();
  await page.getByLabel('Corner radius').fill('12');
  await page.getByLabel('Corner radius').press('Enter');
  await page.getByLabel('Block name').fill('box');
  await page.getByLabel('Block name').press('Enter');
  await expect.poll(() => slideFile(root)).toContain('data-name="box"');
  expect(slideFile(root)).toContain('data-radius="12"');

  await page.getByRole('button', { name: 'Arrow' }).click();
  await page.getByRole('button', { name: 'Dashed' }).click();
  await page.getByLabel('X', { exact: true }).fill('50');
  await page.getByLabel('X', { exact: true }).press('Enter');
  await expect.poll(() => slideFile(root)).toMatch(/data-name="arrow-1"[^>]*data-dashed[^>]*data-end="arrow"[^>]*style="left:50px/);

  await page.getByLabel('Block name').fill('box');
  await page.getByLabel('Block name').press('Enter');
  await expect(page.getByText('already used on this slide')).toBeVisible();
});

test('the Link button links the selected text', async ({ page, root }) => {
  page.on('dialog', d => d.accept('https://example.com'));
  await page.mouse.dblclick(...await at(page, 640, 330));
  await page.getByRole('toolbar', { name: 'Text formatting' }).getByRole('button', { name: 'Link' }).click();
  await page.mouse.click(...await at(page, 640, 650));
  await expect.poll(() => slideFile(root)).toContain('<a href="https://example.com">Demo course</a>');
});
