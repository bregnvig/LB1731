import { Animation, Block, Border, Effect, Fragment, Slide, SlideFile } from './model';

// A slide file is one <section> of absolutely positioned `.block` divs plus <aside class="notes">.
// serializeSlide writes a fixed layout (attribute order, indentation) so diffs stay readable
// and parse → serialize returns the same text.

const escapeText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (s: string) => escapeText(s).replace(/"/g, '&quot;');
const px = (v: string) => parseFloat(v) || 0;

// Read from the raw style text: the browser would normalize colors (#ff9900 → rgb(255, 153, 0)).
function parseBorder(style: string): { border?: Border } {
  const m = /(?:^|;)\s*border:\s*([\d.]+)px\s+(solid|dashed)\s+([^;]+)/.exec(style);
  if (!m) return {};
  const radius = /(?:^|;)\s*border-radius:\s*([\d.]+)px/.exec(style);
  return { border: { width: Number(m[1]), style: m[2] as Border['style'], color: m[3].trim(), radius: radius ? Number(radius[1]) : 0 } };
}

// Declarations written by blockStyle(); everything else in a block's style is kept as extraStyle.
const MODELED = new Set(['left', 'top', 'width', 'height', 'z-index', 'text-align', 'border', 'border-radius', '--svg-color']);

function parseExtraStyle(style: string): { extraStyle?: string } {
  // border-radius belongs to the modeled border only when the border shorthand is there too.
  const modeled = /(?:^|;)\s*border:/.test(style) ? MODELED : new Set([...MODELED].filter(p => p !== 'border-radius'));
  const extra = style.split(';').map(d => d.trim()).filter(d => d && !modeled.has(d.slice(0, d.indexOf(':')).trim()));
  return extra.length ? { extraStyle: extra.join(';') } : {};
}

// Raw declarations of a style attribute. el.style would round lengths (115.6537px → 115.654px).
function styleDecls(style: string): Map<string, string> {
  return new Map(style.split(';').filter(d => d.includes(':')).map(d => [d.slice(0, d.indexOf(':')).trim(), d.slice(d.indexOf(':') + 1).trim()]));
}

function parseBlock(el: HTMLElement): Block {
  const d = (k: string) => el.getAttribute(`data-${k}`);
  const has = (k: string) => el.hasAttribute(`data-${k}`);
  const st = styleDecls(el.getAttribute('style') ?? '');
  const base = {
    name: d('name') ?? '',
    x: px(st.get('left') ?? ''), y: px(st.get('top') ?? ''), width: px(st.get('width') ?? ''),
    height: st.get('height') === 'auto' ? 'auto' as const : px(st.get('height') ?? ''),
    z: Number(st.get('z-index')) || 0,
    ...parseBorder(el.getAttribute('style') ?? ''),
    ...parseExtraStyle(el.getAttribute('style') ?? ''),
    ...(has('href') ? { href: d('href')! } : {}),
    ...(has('locked') ? { locked: true } : {}),
    ...(has('animate') ? { animation: {
      effect: d('animate') as Effect, duration: Number(d('animate-duration')), delay: Number(d('animate-delay')), on: d('animate-on'),
    } satisfies Animation } : {}),
    ...(el.classList.contains('fragment') ? { fragment: {
      index: has('fragment-index') ? Number(d('fragment-index')) : null,
      style: el.classList.contains('fade-down') ? 'fade-down' : '',
    } satisfies Fragment } : {}),
  };
  const inner = el.innerHTML.trim();
  switch (d('type')) {
    case 'text': return { ...base, type: 'text', html: inner, ...(st.get('text-align') ? { align: st.get('text-align') as 'left' } : {}) };
    case 'code': {
      const pre = el.querySelector('pre')!, code = el.querySelector('code')!;
      return { ...base, type: 'code', code: code.textContent ?? '', lang: code.className.replace(/^language-/, ''),
        theme: d('theme') === 'monokai' ? 'monokai' : 'dark', frame: d('frame') === 'macos' ? 'macos' : 'none',
        lines: code.getAttribute('data-line-numbers'), autoHeight: has('auto-height'), preStyle: pre.getAttribute('style') ?? '' };
    }
    case 'shape': return { ...base, type: 'shape', shape: d('shape') === 'circle' ? 'circle' : 'rect', fill: d('fill') ?? '',
      stroke: d('stroke'), strokeWidth: Number(d('stroke-width') ?? 0), radius: Number(d('radius') ?? 0) };
    case 'line': return { ...base, type: 'line', x1: Number(d('x1')), y1: Number(d('y1')), x2: Number(d('x2')), y2: Number(d('y2')),
      color: d('color') ?? '#ffffff', thickness: Number(d('width') ?? 1), dashed: has('dashed'),
      start: d('start') === 'arrow' ? 'arrow' : 'none', end: d('end') === 'arrow' ? 'arrow' : 'none' };
    case 'image': {
      const img = el.querySelector('img')!;
      return { ...base, type: 'image', src: img.getAttribute('src') ?? '', alt: img.getAttribute('alt') ?? '', inlineSvg: has('inline-svg'),
        svgColor: st.get('--svg-color') || null, imgStyle: img.getAttribute('style') ?? '', keepRatio: has('keep-ratio') };
    }
    case 'group': return { ...base, type: 'group', children: childBlocks(el) };
    case 'drawing': return { ...base, type: 'drawing', svg: inner };
    case 'table': return { ...base, type: 'table', html: inner };
    default: throw new Error(`Unknown block type "${d('type')}" in block "${base.name}"`);
  }
}

const childBlocks = (parent: Element) =>
  [...parent.children].filter((c): c is HTMLElement => c.classList.contains('block')).map(parseBlock);

export function parseSlide(file: SlideFile): Slide {
  const section = new DOMParser().parseFromString(file.html, 'text/html').querySelector('section');
  if (!section) throw new Error(`${file.path}: no <section>`);
  const slide: Slide = {
    path: file.path, hidden: file.hidden, etag: file.etag,
    autoAnimate: section.hasAttribute('data-auto-animate'),
    ...(section.hasAttribute('data-template') && { template: section.getAttribute('data-template')! }),
    blocks: childBlocks(section),
    notes: section.querySelector(':scope > aside.notes')?.textContent ?? '',
  };
  // Anything the model doesn't hold shows up as a difference when written back.
  const norm = (s: string) => s.replace(/\r\n/g, '\n').trim();
  return norm(serializeSlide(slide)) === norm(file.html) ? slide : { ...slide, dropsMarkup: true };
}

function blockAttrs(b: Block): string[] {
  const a: [string, string | number | true | null | undefined][] = [];
  switch (b.type) {
    case 'code': a.push(['theme', b.theme], ['frame', b.frame === 'macos' ? 'macos' : null], ['auto-height', b.autoHeight || null]); break;
    case 'shape': a.push(['shape', b.shape], ['fill', b.fill], ['stroke', b.stroke], ['stroke-width', b.strokeWidth], ['radius', b.radius]); break;
    case 'line': a.push(['x1', b.x1], ['y1', b.y1], ['x2', b.x2], ['y2', b.y2], ['color', b.color], ['width', b.thickness],
      ['dashed', b.dashed || null], ['start', b.start], ['end', b.end]); break;
    case 'image': a.push(['inline-svg', b.inlineSvg || null], ['keep-ratio', b.keepRatio || null]); break;
  }
  a.push(['href', b.href], ['locked', b.locked || null]);
  if (b.animation) a.push(['animate', b.animation.effect], ['animate-duration', b.animation.duration],
    ['animate-delay', b.animation.delay], ['animate-on', b.animation.on]);
  if (b.fragment?.index != null) a.push(['fragment-index', b.fragment.index]);
  return a.filter(([, v]) => v != null).map(([k, v]) => v === true ? `data-${k}` : `data-${k}="${escapeAttr(String(v))}"`);
}

// 4 decimals is far below a pixel and drops floating point noise like 348.60799999999995.
const n4 = (n: number) => Number(n.toFixed(4));

function blockStyle(b: Block): string {
  const s = [`left:${n4(b.x)}px`, `top:${n4(b.y)}px`, `width:${n4(b.width)}px`, `height:${b.height === 'auto' ? 'auto' : `${n4(b.height)}px`}`, `z-index:${b.z}`];
  if (b.type === 'text' && b.align) s.push(`text-align:${b.align}`);
  if (b.border) {
    s.push(`border:${b.border.width}px ${b.border.style} ${b.border.color}`);
    if (b.border.radius) s.push(`border-radius:${b.border.radius}px`);
  }
  if (b.type === 'image' && b.svgColor) s.push(`--svg-color:${b.svgColor}`);
  if (b.extraStyle) s.push(b.extraStyle);
  return s.join(';');
}

function serializeBlock(b: Block, indent: string): string {
  const cls = ['block', ...(b.fragment ? ['fragment'] : []), ...(b.fragment?.style ? [b.fragment.style] : [])].join(' ');
  const open = [`<div class="${cls}"`, `data-type="${b.type}"`, `data-name="${escapeAttr(b.name)}"`, ...blockAttrs(b), `style="${blockStyle(b)}">`].join(' ');
  const inner = `${indent}  `;
  switch (b.type) {
    case 'shape':
    case 'line':
      return `${indent}${open}</div>`;
    case 'code': {
      const lines = b.lines == null ? '' : ` data-line-numbers="${escapeAttr(b.lines)}"`;
      const pre = b.preStyle ? `<pre style="${escapeAttr(b.preStyle)}">` : '<pre>';
      return `${indent}${open}\n${inner}${pre}<code class="language-${b.lang}"${lines}>${escapeText(b.code)}</code></pre>\n${indent}</div>`;
    }
    case 'image': {
      const style = b.imgStyle ? ` style="${escapeAttr(b.imgStyle)}"` : '';
      return `${indent}${open}\n${inner}<img src="${escapeAttr(b.src)}" alt="${escapeAttr(b.alt)}"${style}>\n${indent}</div>`;
    }
    case 'group':
      return `${indent}${open}\n${b.children.map(c => serializeBlock(c, inner)).join('\n')}\n${indent}</div>`;
    case 'drawing':
      return `${indent}${open}\n${inner}${b.svg}\n${indent}</div>`;
    default:
      return `${indent}${open}\n${inner}${b.html}\n${indent}</div>`;
  }
}

export function serializeSlide(slide: Slide): string {
  const attrs = [slide.autoAnimate && 'data-auto-animate', slide.template && `data-template="${escapeAttr(slide.template)}"`].filter(Boolean);
  const open = `<section${attrs.map(a => ' ' + a).join('')}>`;
  const notes = slide.notes ? [`  <aside class="notes">${escapeText(slide.notes)}</aside>`] : [];
  return [open, ...slide.blocks.map(b => serializeBlock(b, '  ')), ...notes, '</section>', ''].join('\n');
}

export function blockNames(slide: Slide): string[] {
  const walk = (blocks: Block[]): string[] => blocks.flatMap(b => [b.name, ...(b.type === 'group' ? walk(b.children) : [])]);
  return walk(slide.blocks);
}
