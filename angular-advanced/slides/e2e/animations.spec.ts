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

test('clicking the target again plays the block back out', async ({ page }) => {
  await page.goto('/present#/1/2');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  const answer = page.locator('section.present [data-name="answer"]');
  const question = page.locator('section.present [data-name="question"]');
  await question.click();
  await expect(answer).toHaveCSS('opacity', '1', { timeout: 1000 });
  await question.click();
  await expect(answer).toHaveCSS('opacity', '0', { timeout: 1000 });
});

test('a group whose box covers the click target does not swallow the click', async ({ page }) => {
  await page.goto('/present#/1/2');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  const boxed = page.locator('section.present [data-name="boxed"]');
  await page.waitForTimeout(300);
  await expect(boxed).toHaveCSS('opacity', '0');
  await page.locator('section.present [data-name="question"]').click();
  await expect(boxed).toHaveCSS('opacity', '1', { timeout: 1000 });
});

test('a hidden block stays hidden while its slide moves away', async ({ page }) => {
  await page.goto('/present#/1/2');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  await page.waitForTimeout(300);
  // Sample the answer's opacity through the whole transition to the next slide.
  const seen = await page.evaluate(() => new Promise<string[]>(done => {
    const answer = document.querySelector<HTMLElement>('section.present [data-name="answer"]')!;
    const samples: string[] = [];
    const timer = setInterval(() => samples.push(getComputedStyle(answer).opacity), 20);
    (window as any).Reveal.down();
    setTimeout(() => { clearInterval(timer); done([...new Set(samples)]); }, 1200);
  }));
  expect(seen).toEqual(['0']);
});

test('an entry animation plays when the slide appears', async ({ page }) => {
  await page.goto('/present#/1/2');
  await page.waitForFunction(() => (window as any).Reveal?.isReady?.());
  await page.waitForTimeout(1000);
  await expect(page.locator('section.present [data-name="intro"]')).toHaveCSS('opacity', '1');
});
