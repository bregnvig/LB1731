import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from './editor-fixture';

test('notes are written to the slide file', async ({ page, editor, root }) => {
  await page.goto(`${editor}/edit`);
  await page.getByLabel('Course').selectOption('demo');
  await page.getByLabel('Speaker notes').fill('Remember the demo');
  await expect(page.getByTestId('status')).toHaveText('Saved to disk');
  await expect.poll(() => readFileSync(join(root, 'courses/demo/slides/demo.html'), 'utf8'))
    .toContain('<aside class="notes">Remember the demo</aside>');
  // The address bar follows the slide, so a reload reopens it.
  await expect(page).toHaveURL(/\/edit\/demo\/demo\.html$/);
});

test('a file changed on disk is not overwritten', async ({ page, editor, root }) => {
  const file = join(root, 'courses/demo/slides/demo.html');
  await page.goto(`${editor}/edit/demo/demo.html`);
  await expect(page.getByLabel('Speaker notes')).toBeVisible();
  const outside = readFileSync(file, 'utf8').replace('</section>', '  <aside class="notes">Edited elsewhere</aside>\n</section>');
  writeFileSync(file, outside);
  await page.getByLabel('Speaker notes').fill('Mine');
  await expect(page.getByRole('alert')).toContainText('changed on disk');
  expect(readFileSync(file, 'utf8')).toBe(outside);
  await page.getByRole('button', { name: 'Reload from disk' }).click();
  await expect(page.getByLabel('Speaker notes')).toHaveValue('Edited elsewhere');
  await expect(page.getByTestId('status')).toHaveText('Saved to disk');
});

test('slides can be added, hidden and reordered', async ({ page, editor, root }) => {
  const order = () => JSON.parse(readFileSync(join(root, 'courses/demo/slides/deck.json'), 'utf8')).slides;
  await page.goto(`${editor}/edit/demo/demo.html`);
  await page.getByRole('button', { name: '+ Add slide' }).click();
  await expect.poll(() => order()[1]).toEqual({ file: 'slide-1.html' });
  await expect(page).toHaveURL(/slide-1\.html$/);

  await page.getByLabel('Hidden from the deck').check();
  await expect.poll(() => order()[1]).toEqual({ file: 'slide-1.html', hidden: true });

  await page.locator('nav [data-slide="courses/demo/slides/slide-1.html"]').dragTo(page.locator('nav [data-slide="courses/demo/slides/demo.html"]'));
  await expect.poll(() => order().map((s: { file: string }) => s.file).slice(0, 2)).toEqual(['slide-1.html', 'demo.html']);
});
