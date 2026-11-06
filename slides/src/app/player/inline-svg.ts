/**
 * Image blocks marked data-inline-svg get their SVG markup inlined, so deck.css can recolor it
 * with the block's --svg-color. If the file can't be loaded the plain <img> stays.
 */
export async function inlineSvgImages(root: ParentNode): Promise<void> {
  const blocks = [...root.querySelectorAll<HTMLElement>('.block[data-inline-svg]:not(.svg-inlined)')];
  await Promise.all(blocks.map(async block => {
    const img = block.querySelector('img');
    if (!img) return;
    try {
      const res = await fetch(img.getAttribute('src')!);
      if (!res.ok) return;
      const svg = new DOMParser().parseFromString(await res.text(), 'image/svg+xml').querySelector('svg');
      if (!svg) return;
      block.append(document.importNode(svg, true));
      block.classList.add('svg-inlined');
    } catch {
      // keep the <img>
    }
  }));
}
