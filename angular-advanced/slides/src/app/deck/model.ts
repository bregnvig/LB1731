export type Effect = 'fade-in' | 'fade-out' | 'scale-up' | 'scale-down' | 'slide-up' | 'slide-down';

/** `on` is the name of the block whose click starts the animation; null plays it when the slide appears. */
export interface Animation { effect: Effect; duration: number; delay: number; on: string | null }

export interface Fragment { index: number | null; style: '' | 'fade-down' }

export interface Border { width: number; style: 'solid' | 'dashed'; color: string; radius: number }

interface BlockBase {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number | 'auto';
  z: number;
  border?: Border;
  locked?: boolean;
  animation?: Animation;
  fragment?: Fragment;
  /** The whole block is a link (opens in a new tab). */
  href?: string;
  /** CSS declarations the model has no field for (rotation, font size, color…), kept verbatim. */
  extraStyle?: string;
}

export type TextBlock = BlockBase & { type: 'text'; html: string; align?: 'left' | 'center' | 'right' | 'justify' };
export type CodeBlock = BlockBase & {
  type: 'code'; code: string; lang: string; theme: 'dark' | 'monokai'; frame: 'none' | 'macos';
  /** data-line-numbers: '' shows line numbers, '2,3' highlights lines, null shows neither. */
  lines: string | null; autoHeight: boolean; preStyle: string;
};
export type ShapeBlock = BlockBase & { type: 'shape'; shape: 'rect' | 'circle'; fill: string; stroke: string | null; strokeWidth: number; radius: number };
export type LineBlock = BlockBase & {
  type: 'line'; x1: number; y1: number; x2: number; y2: number; color: string; thickness: number;
  dashed: boolean; start: 'none' | 'arrow'; end: 'none' | 'arrow';
};
export type ImageBlock = BlockBase & { type: 'image'; src: string; alt: string; inlineSvg: boolean; svgColor: string | null; imgStyle: string; keepRatio: boolean };
export type GroupBlock = BlockBase & { type: 'group'; children: Block[] };
export type DrawingBlock = BlockBase & { type: 'drawing'; svg: string };
export type TableBlock = BlockBase & { type: 'table'; html: string };

export type Block = TextBlock | CodeBlock | ShapeBlock | LineBlock | ImageBlock | GroupBlock | DrawingBlock | TableBlock;
export type BlockType = Block['type'];

export interface Slide { path: string; hidden: boolean; autoAnimate: boolean; blocks: Block[]; notes: string; etag: string }
export interface Course { id: string; title: string; slides: Slide[] }
export interface Deck { title: string; intro: Slide[]; courses: Course[] }

/** What the server sends per slide file. */
export interface SlideFile { path: string; hidden: boolean; html: string; etag: string }
