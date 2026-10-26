// highlight.js 10.0.3 has no bundled types; this is the part we use.
declare module 'highlight.js' {
  const hljs: { highlightBlock(element: HTMLElement): void };
  export default hljs;
}
