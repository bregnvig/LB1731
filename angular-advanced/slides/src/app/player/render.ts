import { Block, LineBlock, ShapeBlock, Slide } from '../deck/model';

// Display HTML for slides: the stored format plus what the browser needs to draw it
// (SVG for shapes and lines, highlighter markup for code, image URLs on the content route).

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n: number) => String(Number(n.toFixed(3)));

let clipIds = 0;

function blockOpen(b: Block, tag = 'div'): string {
  const cls = ['block', ...(b.fragment ? ['fragment'] : []), ...(b.fragment?.style ? [b.fragment.style] : [])].join(' ');
  const style = [`left:${b.x}px`, `top:${b.y}px`, `width:${b.width}px`, `height:${b.height === 'auto' ? 'auto' : `${b.height}px`}`, `z-index:${b.z}`];
  if (b.type === 'text' && b.align) style.push(`text-align:${b.align}`);
  if (b.border) style.push(`border:${b.border.width}px ${b.border.style} ${b.border.color}`, `border-radius:${b.border.radius}px`);
  if (b.type === 'image' && b.svgColor) style.push(`--svg-color:${b.svgColor}`);
  if (b.extraStyle) style.push(b.extraStyle);
  const attrs = [`class="${cls}"`, `data-type="${b.type}"`, `data-name="${esc(b.name)}"`];
  if (b.fragment?.index != null) attrs.push(`data-fragment-index="${b.fragment.index}"`);
  if (b.animation) {
    attrs.push(`data-animate="${b.animation.effect}"`, `data-animate-duration="${b.animation.duration}"`, `data-animate-delay="${b.animation.delay}"`);
    if (b.animation.on) attrs.push(`data-animate-on="${esc(b.animation.on)}"`);
  }
  if (b.type === 'code') attrs.push(`data-theme="${b.theme}"`, ...(b.frame === 'macos' ? ['data-frame="macos"'] : []));
  if (b.type === 'image' && b.inlineSvg) attrs.push('data-inline-svg');
  if (b.href) attrs.push(`href="${esc(b.href)}"`, 'target="_blank"');
  return `<${tag} ${attrs.join(' ')} style="${style.join(';')}">`;
}

function shapeSvg(b: ShapeBlock): string {
  const w = num(b.width), h = num(b.height === 'auto' ? 0 : b.height);
  const geometry = b.shape === 'circle'
    ? `rx="${num(b.width / 2)}" ry="${num(Number(h) / 2)}" cx="${num(b.width / 2)}" cy="${num(Number(h) / 2)}"`
    : `width="${w}" height="${h}" rx="${num(b.radius)}" ry="${num(b.radius)}"`;
  const tag = b.shape === 'circle' ? 'ellipse' : 'rect';
  // The stroke is drawn twice as wide and clipped to the shape, so it sits inside the box.
  if (!b.stroke || !b.strokeWidth) {
    return `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 ${w} ${h}"><${tag} ${geometry} fill="${esc(b.fill)}"></${tag}></svg>`;
  }
  const id = `clip-${++clipIds}`;
  return `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 ${w} ${h}">`
    + `<defs><clipPath id="${id}"><${tag} ${geometry}></${tag}></clipPath></defs>`
    + `<${tag} ${geometry} clip-path="url(#${id})" fill="${esc(b.fill)}" stroke="${esc(b.stroke)}" stroke-width="${num(b.strokeWidth * 2)}"></${tag}></svg>`;
}

function lineSvg(b: LineBlock): string {
  const w = b.thickness;
  const len = Math.hypot(b.x2 - b.x1, b.y2 - b.y1) || 1;
  const ux = (b.x2 - b.x1) / len, uy = (b.y2 - b.y1) / len;
  const nx = -uy, ny = ux;
  // At an arrowhead the line stops short (further when dashed) and the open chevron's tip sits just inside the end point.
  const cut = b.dashed ? 1.5 * w : w;
  const sx = b.start === 'arrow' ? b.x1 + ux * cut : b.x1, sy = b.start === 'arrow' ? b.y1 + uy * cut : b.y1;
  const ex = b.end === 'arrow' ? b.x2 - ux * cut : b.x2, ey = b.end === 'arrow' ? b.y2 - uy * cut : b.y2;
  const arrow = (px: number, py: number, dx: number, dy: number, which: string) => {
    const tipOffset = 0.75 * w - 1, wing = 2.25 * w;
    const tx = px - dx * tipOffset, ty = py - dy * tipOffset;
    const ax = tx - dx * wing - nx * wing, ay = ty - dy * wing - ny * wing;
    const bx = tx - dx * wing + nx * wing, by = ty - dy * wing + ny * wing;
    return `<path data-arrow="${which}" stroke="${esc(b.color)}" stroke-width="${num(w)}" d="M ${num(ax)} ${num(ay)} L ${num(tx)} ${num(ty)} L ${num(bx)} ${num(by)} L ${num(tx)} ${num(ty)}"></path>`;
  };
  let dash = '';
  if (b.dashed) {
    const dl = Math.hypot(ex - sx, ey - sy), d = 3 * w;
    const n = Math.max(2, Math.floor((dl + w) / (4 * w)));
    const gap = (dl - n * d) / (n - 1);
    dash = ` stroke-dasharray="${Array(n).fill(`${d} ${gap}`).join(' ')}"`;
  }
  // At least 1px each way, or a vertical or horizontal line gets an empty viewBox and isn't drawn.
  const W = Math.max(b.x1, b.x2, 1), H = Math.max(b.y1, b.y2, 1);
  return `<svg preserveAspectRatio="xMidYMid" width="${num(W)}" height="${num(H)}" viewBox="0 0 ${num(W)} ${num(H)}">`
    + `<path data-line fill="rgba(0,0,0,0)" stroke="${esc(b.color)}" stroke-width="${num(w)}"${dash} d="M${num(sx)} ${num(sy)} L${num(ex)} ${num(ey)}"></path>`
    + (b.start === 'arrow' ? arrow(b.x1, b.y1, -ux, -uy, 'start') : '')
    + (b.end === 'arrow' ? arrow(b.x2, b.y2, ux, uy, 'end') : '')
    + '</svg>';
}

function inner(b: Block, baseUrl: string): string {
  switch (b.type) {
    case 'text': return b.html;
    case 'table': return b.html;
    case 'drawing': return b.svg;
    case 'shape': return shapeSvg(b);
    case 'line': return lineSvg(b);
    case 'image': {
      const style = b.imgStyle ? ` style="${esc(b.imgStyle)}"` : '';
      return `<img src="${esc(`${baseUrl}/${b.src}`)}" alt="${esc(b.alt)}"${style}>`;
    }
    case 'code': {
      // No language class: the highlighter detects the language itself.
      const cls = b.lang && b.lang !== 'auto' ? ` class="language-${b.lang}"` : '';
      const lines = b.lines == null ? '' : ` data-line-numbers="${esc(b.lines)}"`;
      const pre = b.preStyle ? `<pre style="${esc(b.preStyle)}">` : '<pre>';
      return `${pre}<code${cls}${lines}>${esc(b.code)}</code></pre>`;
    }
    case 'group': return b.children.map(c => renderBlock(c, baseUrl)).join('');
  }
}

export function renderBlock(b: Block, baseUrl: string): string {
  const tag = b.href ? 'a' : 'div';
  return `${blockOpen(b, tag)}${inner(b, baseUrl)}</${tag}>`;
}

export const slideFolder = (path: string) => path.slice(0, path.lastIndexOf('/'));

export function renderSlide(slide: Slide, baseUrl = `/content/${slideFolder(slide.path)}`): string {
  const attrs = [`data-path="${esc(slide.path)}"`, ...(slide.autoAnimate ? ['data-auto-animate'] : []), ...(slide.hidden ? ['data-visibility="hidden"'] : [])];
  const notes = slide.notes ? `<aside class="notes">${esc(slide.notes)}</aside>` : '';
  return `<section ${attrs.join(' ')}>${slide.blocks.map(b => renderBlock(b, baseUrl)).join('')}${notes}</section>`;
}
