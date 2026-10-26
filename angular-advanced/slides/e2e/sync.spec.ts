import { expect, test, type Page } from '@playwright/test';

const ready = (page: Page) => page.waitForFunction(() => (window as any).Reveal?.isReady?.());
const indices = (page: Page) => page.evaluate(() => (window as any).Reveal.getIndices());
const currentFrame = (page: Page) => page.frameLocator('iframe.current');

test('the presenter drives the presentation and shows notes', async ({ context }) => {
  const show = await context.newPage();
  await show.goto('/present');
  await ready(show);
  const presenter = await context.newPage();
  await presenter.goto('/presenter');
  await expect(presenter.getByTestId('notes')).toHaveText('Introduce yourself.');

  await presenter.keyboard.press('ArrowRight');
  await expect.poll(() => indices(show), { timeout: 1000 }).toMatchObject({ h: 1, v: 0 });

  // Into the demo stack, to the animations slide (the hidden draft is skipped).
  await show.evaluate(() => (window as any).Reveal.slide(1, 2));
  await expect(presenter.getByTestId('notes')).toHaveText('Ask before clicking.');
});

test('a click in the presentation plays in the presenter, and a reload catches up', async ({ context }) => {
  const show = await context.newPage();
  await show.goto('/present#/1/2');
  await ready(show);
  const presenter = await context.newPage();
  await presenter.goto('/presenter');
  const answer = currentFrame(presenter).locator('section.present [data-name="answer"]');
  await expect(answer).toHaveCSS('opacity', '0');

  await show.locator('section.present [data-name="question"]').click();
  await expect(answer).toHaveCSS('opacity', '1', { timeout: 2000 });

  await show.goto('/present');
  await show.reload();
  await ready(show);
  await expect.poll(() => indices(show), { timeout: 1000 }).toMatchObject({ h: 1, v: 2 });
  await expect(show.locator('section.present [data-name="answer"]')).toHaveCSS('opacity', '1', { timeout: 1000 });
});

test('the next view shows where the presentation goes when moving back into a course', async ({ context }) => {
  const show = await context.newPage();
  await show.goto('/present#/1/3');
  await ready(show);
  const presenter = await context.newPage();
  await presenter.goto('/presenter');
  const next = presenter.frameLocator('iframe.next').locator('body');
  const nextIndices = () => next.evaluate(() => (window as any).Reveal?.getIndices?.());
  await expect.poll(nextIndices, { timeout: 3000 }).toMatchObject({ h: 1, v: 4 });

  // Out of the course, then the next view must match where Right actually lands.
  await presenter.keyboard.press('ArrowLeft');
  await expect.poll(() => indices(show), { timeout: 1000 }).toMatchObject({ h: 0, v: 0 });
  const expected = await nextIndices();
  await presenter.keyboard.press('ArrowRight');
  await expect.poll(() => indices(show), { timeout: 1000 }).toMatchObject({ h: expected.h, v: expected.v });
});

test('the next view is one step ahead', async ({ context }) => {
  const presenter = await context.newPage();
  await presenter.goto('/presenter');
  const next = presenter.frameLocator('iframe.next');
  await expect.poll(() => next.locator('body').evaluate(() => (window as any).Reveal?.getIndices?.().h), { timeout: 3000 }).toBe(1);
});
