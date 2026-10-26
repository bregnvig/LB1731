import { expect, test } from '@playwright/test';

test('a click-triggered block waits for its target and then appears', async ({ page }) => {
  await page.goto('/present#/1/2');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  const answer = page.locator('section.present [data-name="answer"]');
  await page.waitForTimeout(300);
  await expect(answer).toHaveCSS('opacity', '0');
  await page.locator('section.present [data-name="question"]').click();
  await page.waitForTimeout(1000);
  await expect(answer).toHaveCSS('opacity', '1');
});

test('an entry animation plays when the slide appears', async ({ page }) => {
  await page.goto('/present#/1/2');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  await page.waitForTimeout(1000);
  await expect(page.locator('section.present [data-name="intro"]')).toHaveCSS('opacity', '1');
});
