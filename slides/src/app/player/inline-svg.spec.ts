import { afterEach, describe, expect, it, vi } from 'vitest';
import { inlineSvgImages } from './inline-svg';

describe('inlineSvgImages', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('puts the SVG markup in the block so CSS can color it, and marks the block', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<svg viewBox="0 0 10 10"><path d="M0 0"/></svg>')));
    document.body.innerHTML = '<div class="block" data-type="image" data-inline-svg><img src="/content/x/images/a.svg"></div>';
    await inlineSvgImages(document.body);
    const block = document.querySelector('.block')!;
    expect(block.querySelector('svg path')).toBeTruthy();
    expect(block.classList.contains('svg-inlined')).toBe(true);
    expect(fetch).toHaveBeenCalledWith('/content/x/images/a.svg');
  });

  it('leaves the image alone when the SVG cannot be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 404 })));
    document.body.innerHTML = '<div class="block" data-type="image" data-inline-svg><img src="/content/x/images/a.svg"></div>';
    await inlineSvgImages(document.body);
    expect(document.querySelector('.block')!.classList.contains('svg-inlined')).toBe(false);
    expect(document.querySelector('svg')).toBeNull();
  });
});
