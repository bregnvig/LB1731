import { staticExport } from '../deck/static-export';

/**
 * Image blocks marked data-inline-svg get their SVG markup inlined, so deck.css can recolor it
 * with the block's --svg-color. If the file can't be loaded the plain <img> stays. An exported deck
 * carries the markup itself, since a page opened from disk can't fetch files.
 */
export async function inlineSvgImages(root: ParentNode): Promise<void> {
  const blocks = [...root.querySelectorAll<HTMLElement>('.block[data-inline-svg]:not(.svg-inlined)')];
  await Promise.all(blocks.map(async block => {
    const img = block.querySelector('img');
    if (!img) return;
    try {
      const src = img.getAttribute('src')!;
      let text = staticExport?.svgs[src];
      if (text == null) {
        const res = await fetch(src);
        if (!res.ok) return;
        text = await res.text();
      }
      const svg = new DOMParser().parseFromString(text, 'image/svg+xml').querySelector('svg');
      if (!svg) return;
      block.append(document.importNode(svg, true));
      block.classList.add('svg-inlined');
    } catch {
      // keep the <img>
    }
  }));
}
