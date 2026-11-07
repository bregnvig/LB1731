import type { DeckJson } from './deck.service';

/**
 * Set by an exported deck's deck.js (scripts/export.mjs): the deck itself and the SVGs to inline,
 * so the presentation runs from index.html with no server. Undefined when the server serves the app.
 */
export interface StaticExport { deck: DeckJson; svgs: Record<string, string> }

export const staticExport = (globalThis as { __SLIDES_EXPORT__?: StaticExport }).__SLIDES_EXPORT__;
