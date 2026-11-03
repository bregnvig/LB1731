import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// A 20 × 10 version of swings.webp, made with: magick swings.webp -resize 20x10 -quality 50 swings-tiny.webp
const SWINGS_PLACEHOLDER = 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACQBACdASoUAAoAPtFUo0uoJKMhsAgBABoJagCdMoRwN4BvAAEyuoLCBfyXaAAA/YL3tIAxfDz7ab/yFtly0//EgTcpyCP+0lUHFOKbJxJxDJIgAAA=';

@Component({
  selector: 'loop-images',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  styles: `
    img { max-width: 100%; height: auto; }
    pre { white-space: pre-wrap; word-break: break-all; }
    .fill-box { position: relative; height: 300px; }
    .fill-box img { object-fit: cover; }
  `,
  template: `
    <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
      <h2 class="mb-0 me-3">ngSrc</h2>
      <!-- Full reloads: LCP is measured on a fresh page load only. Absolute paths: the LCP check
           resolves a relative ngSrc against the page URL, not <base href>, and would never match. -->
      <a class="btn btn-outline-primary" href="/performance/images">Reload without priority</a>
      <a class="btn btn-outline-primary" href="/performance/images?priority">Reload with priority</a>
    </div>
    <p class="text-muted">Console open: no <code>priority</code> on the LCP image logs <b>NG02955</b>.</p>

    <h4>Hero, {{ priority ? 'with' : 'without' }} <code>priority</code></h4>
    <img ngSrc="/assets/performance/hero.webp" width="2400" height="1200" [priority]="priority" alt="Green hero image">
    <pre class="fs-5 mt-2"><code>&lt;img ngSrc="/assets/performance/hero.webp" width="2400" height="1200"{{ priority ? ' priority' : '' }}&gt;</code></pre>

    <h4 class="mt-5"><code>fill</code></h4>
    <div class="fill-box">
      <img ngSrc="/assets/performance/sandbox.webp" fill alt="Blue image filling a 300px high box">
    </div>
    <pre class="fs-5 mt-2"><code>&lt;div class="fill-box"&gt;&lt;img ngSrc="/assets/performance/sandbox.webp" fill&gt;&lt;/div&gt;</code></pre>

    <h4 class="mt-5"><code>placeholder</code></h4>
    <img ngSrc="/assets/performance/swings.webp" width="2000" height="1000" [placeholder]="placeholder" alt="Orange image with a blurred placeholder">
    <pre class="fs-5 mt-2"><code>&lt;img ngSrc="/assets/performance/swings.webp" width="2000" height="1000" placeholder="data:image/webp;base64,..."&gt;</code></pre>
  `,
})
export class ImagesComponent {
  protected priority = inject(ActivatedRoute).snapshot.queryParamMap.has('priority');
  protected placeholder = SWINGS_PLACEHOLDER;
}
