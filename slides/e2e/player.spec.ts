import { expect, test } from '@playwright/test';

const current = '.reveal .slides section.present:not(.stack)';

test.beforeEach(async ({ page }) => {
  await page.goto('/present');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
});

test('starts on the first intro slide', async ({ page }) => {
  await expect(page.locator('.reveal .slide-number')).toHaveText('1');
  await expect(page.locator(current)).toContainText('Welcome');
});

test('navigates right into a course and down through it', async ({ page }) => {
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(current)).toContainText('Demo course');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator(current)).toContainText('Fragments');
});

test('skips hidden slides', async ({ page }) => {
  await page.goto('/present#/1/1');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  await page.keyboard.press('ArrowDown'); // fragment
  await page.keyboard.press('ArrowDown'); // next slide
  await expect(page.locator(current)).toContainText('Click me');
  await expect(page.locator('.reveal')).not.toContainText('Draft');
});

test('deep link opens a fragment step', async ({ page }) => {
  await page.goto('/present#/1/1/0');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  await expect(page.locator('[data-name="step-1"]')).toHaveClass(/visible/);
});
