import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HoverLoadedComponent } from './loaded/hover-loaded.component';
import { IdleLoadedComponent } from './loaded/idle-loaded.component';
import { InteractionLoadedComponent } from './loaded/interaction-loaded.component';
import { PrefetchLoadedComponent } from './loaded/prefetch-loaded.component';
import { TimerLoadedComponent } from './loaded/timer-loaded.component';
import { ViewportLoadedComponent } from './loaded/viewport-loaded.component';
import { WhenLoadedComponent } from './loaded/when-loaded.component';

@Component({
  selector: 'loop-defer-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HoverLoadedComponent, IdleLoadedComponent, InteractionLoadedComponent, PrefetchLoadedComponent,
    TimerLoadedComponent, ViewportLoadedComponent, WhenLoadedComponent,
  ],
  styles: `
    .placeholder-box { border: 3px dashed #adb5bd; border-radius: .5rem; padding: .75rem; font-size: 1.1rem; min-height: 4rem; }
  `,
  template: `
    <h2>&#64;defer triggers</h2>
    <p class="text-muted">DevTools, Network, filter <b>JS</b>, reload. Each card names the chunk it came from.</p>

    <div class="row row-cols-1 row-cols-md-3 g-3">
      <div class="col"><div class="card h-100"><div class="card-body">
        <h4><code>on idle</code></h4>
        @defer (on idle) {
          <loop-idle-loaded />
        } @placeholder {
          <div class="placeholder-box">Waits for the browser to be idle</div>
        } @loading (after 100ms; minimum 1s) {
          <div class="placeholder-box">Loading ...</div>
        }
      </div></div></div>

      <div class="col"><div class="card h-100"><div class="card-body">
        <h4><code>on timer(3s)</code></h4>
        @defer (on timer(3s)) {
          <loop-timer-loaded />
        } @placeholder {
          <div class="placeholder-box">Loads 3 seconds after the page</div>
        } @loading (after 100ms; minimum 1s) {
          <div class="placeholder-box">Loading ...</div>
        }
      </div></div></div>

      <div class="col"><div class="card h-100"><div class="card-body">
        <h4><code>on hover</code></h4>
        @defer (on hover) {
          <loop-hover-loaded />
        } @placeholder {
          <div class="placeholder-box">Hover me</div>
        } @loading (after 100ms; minimum 1s) {
          <div class="placeholder-box">Loading ...</div>
        }
      </div></div></div>

      <div class="col"><div class="card h-100"><div class="card-body">
        <h4><code>on interaction</code></h4>
        @defer (on interaction) {
          <loop-interaction-loaded />
        } @placeholder {
          <div class="placeholder-box" role="button">Click me</div>
        } @loading (after 100ms; minimum 1s) {
          <div class="placeholder-box">Loading ...</div>
        }
      </div></div></div>

      <div class="col"><div class="card h-100"><div class="card-body">
        <h4><code>when show()</code></h4>
        <label class="form-check fs-5 mb-2">
          <input type="checkbox" class="form-check-input" [checked]="show()" (change)="show.set(!show())"> show()
        </label>
        @defer (when show()) {
          <loop-when-loaded />
        } @placeholder {
          <div class="placeholder-box">Tick the box. Untick it: the block stays</div>
        } @loading (after 100ms; minimum 1s) {
          <div class="placeholder-box">Loading ...</div>
        }
      </div></div></div>

      <div class="col"><div class="card h-100"><div class="card-body">
        <h4><code>on interaction; prefetch on idle</code></h4>
        @defer (on interaction; prefetch on idle) {
          <loop-prefetch-loaded />
        } @placeholder {
          <div class="placeholder-box" role="button">Downloaded already. Click me</div>
        } @loading (after 100ms; minimum 1s) {
          <div class="placeholder-box">Loading ...</div>
        }
      </div></div></div>
    </div>

    <p class="fs-4 text-center text-muted my-5">Scroll down for <code>on viewport</code> ↓</p>
    <div style="height: 120vh"></div>

    <div class="card"><div class="card-body">
      <h4><code>on viewport</code></h4>
      @defer (on viewport) {
        <loop-viewport-loaded />
      } @placeholder {
        <div class="placeholder-box">Loads when this box scrolls into view</div>
      } @loading (after 100ms; minimum 1s) {
        <div class="placeholder-box">Loading ...</div>
      }
    </div></div>
  `,
})
export class DeferBoardComponent {
  protected show = signal(false);
}
