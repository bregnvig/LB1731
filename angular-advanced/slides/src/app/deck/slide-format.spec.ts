import { describe, expect, it } from 'vitest';
import { blockNames, parseSlide, serializeSlide } from './slide-format';

const file = (html: string) => ({ path: 'courses/rxjs/slides/demo.html', hidden: false, html, etag: 'e' });

const everyType = `<section data-auto-animate>
  <div class="block" data-type="text" data-name="title" style="left:102px;top:43px;width:1076px;height:auto;z-index:10">
    <h2>Example using switchMap</h2>
  </div>
  <div class="block" data-type="text" data-name="answer" data-animate="fade-in" data-animate-duration="0.6" data-animate-delay="0" data-animate-on="code-1" style="left:296px;top:395px;width:600px;height:auto;z-index:15;text-align:center">
    <p>That's a <b>subscription</b> inside a subscription!</p>
  </div>
  <div class="block fragment fade-down" data-type="code" data-name="code-1" data-theme="dark" data-frame="macos" data-auto-height data-fragment-index="1" style="left:247px;top:199px;width:786px;height:159px;z-index:14">
    <pre style="font-size:20px;line-height:24px"><code class="language-typescript" data-line-numbers="2,3">a &lt; b &amp;&amp; c</code></pre>
  </div>
  <div class="block" data-type="shape" data-name="shape-1" data-shape="circle" data-fill="#222222" data-stroke="#ffffff" data-stroke-width="2" data-radius="0" data-locked style="left:10px;top:20px;width:100px;height:100px;z-index:1;border:2px dashed #ff9900;border-radius:4px"></div>
  <div class="block" data-type="line" data-name="arrow-1" data-x1="0" data-y1="0" data-x2="140" data-y2="120" data-color="#ff0000" data-width="5" data-dashed data-start="arrow" data-end="none" style="left:342px;top:269px;width:140px;height:120px;z-index:16"></div>
  <div class="block" data-type="image" data-name="image-1" data-inline-svg data-keep-ratio style="left:640px;top:36px;width:602px;height:648px;z-index:12;--svg-color:#ffffff">
    <img src="images/rxjs-logo.svg" alt="RxJS logo" style="left:-7px;top:0px;width:616px;height:648px">
  </div>
  <div class="block" data-type="group" data-name="group-1" style="left:100px;top:500px;width:300px;height:100px;z-index:20">
    <div class="block" data-type="text" data-name="text-1" style="left:0px;top:0px;width:300px;height:auto;z-index:1">
      <p>In a group</p>
    </div>
  </div>
  <div class="block" data-type="drawing" data-name="drawing-1" style="left:0px;top:0px;width:50px;height:50px;z-index:2">
    <svg viewBox="0 0 50 50"><path d="M0 0 L50 50" stroke="#fff" stroke-width="4" fill="none"></path></svg>
  </div>
  <div class="block" data-type="table" data-name="table-1" style="left:0px;top:600px;width:400px;height:100px;z-index:3">
    <table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>
  </div>
  <aside class="notes">Ask the room first.
Then reveal &lt;the answer&gt;.</aside>
</section>`;

describe('slide format', () => {
  it('round-trips a slide with every block type', () => {
    expect(serializeSlide(parseSlide(file(everyType))).trim()).toBe(everyType.trim());
  });

  it('parses an animation with a click trigger', () => {
    const slide = parseSlide(file(`<section>
  <div class="block" data-type="text" data-name="a" data-animate="scale-down" data-animate-duration="0.4" data-animate-delay="0.2" data-animate-on="q" style="left:0px;top:0px;width:10px;height:auto;z-index:1">
    <p>x</p>
  </div>
  <div class="block" data-type="text" data-name="b" data-animate="fade-in" data-animate-duration="0.6" data-animate-delay="0" style="left:0px;top:0px;width:10px;height:auto;z-index:2">
    <p>y</p>
  </div>
</section>`));
    expect(slide.blocks[0].animation).toEqual({ effect: 'scale-down', duration: 0.4, delay: 0.2, on: 'q' });
    expect(slide.blocks[1].animation?.on).toBeNull();
  });

  it('parses code blocks', () => {
    const code = parseSlide(file(everyType)).blocks[2];
    expect(code).toMatchObject({ type: 'code', lang: 'typescript', theme: 'dark', frame: 'macos', lines: '2,3', autoHeight: true, code: 'a < b && c' });
    expect(code.fragment).toEqual({ index: 1, style: 'fade-down' });
  });

  it('parses group children with positions relative to the group', () => {
    const group = parseSlide(file(everyType)).blocks[6];
    expect(group.type).toBe('group');
    if (group.type === 'group') expect(group.children[0]).toMatchObject({ name: 'text-1', x: 0, y: 0, width: 300 });
  });

  it('lists block names including group children', () => {
    expect(blockNames(parseSlide(file(everyType)))).toEqual(
      ['title', 'answer', 'code-1', 'shape-1', 'arrow-1', 'image-1', 'group-1', 'text-1', 'drawing-1', 'table-1']);
  });

  it('keeps notes, auto-animate, path, hidden and etag', () => {
    const slide = parseSlide({ ...file(everyType), hidden: true });
    expect(slide).toMatchObject({ path: 'courses/rxjs/slides/demo.html', hidden: true, autoAnimate: true, etag: 'e' });
    expect(slide.notes).toBe('Ask the room first.\nThen reveal <the answer>.');
  });
});
