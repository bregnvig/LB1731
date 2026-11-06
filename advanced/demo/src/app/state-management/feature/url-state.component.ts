import { JsonPipe } from '@angular/common';
import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'loop-url-state',
  standalone: true,
  imports: [JsonPipe, RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="url-demo">
      <h2>Change URL State</h2>
      <nav class="segmented" aria-label="Change URL state">
        <a [routerLink]="[]" [queryParams]="{ a: randomString(), b: randomString() }" queryParamsHandling="merge">
          Navigate with query params
        </a>
        <a [routerLink]="[{matrixKey: randomString()}]" queryParamsHandling="merge">
          Navigate with placeholder and matrix params
        </a>
        <a [routerLink]="['child-route', randomNumber(), {matrixKey: randomString()}]" queryParamsHandling="merge">
          Navigate with child-route placeholder and matrix params
        </a>
      </nav>

      <section class="route-panel">
        <h2>UrlStateComponent</h2>
        <dl class="readout">
          <dt>Route Params</dt><dd>{{ params() | json }}</dd>
          <dt>Query Params</dt><dd>{{ queryParams() | json }}</dd>
        </dl>

        <section class="route-panel outlet">
          <h2><code>&lt;router-outlet&gt;</code> UrlStateChildRouteComponent</h2>
          <router-outlet></router-outlet>
        </section>
      </section>
    </div>
  `,
  styleUrl: './url-state.component.scss',
})
export class UrlStateComponent {
  #activeRoute = inject(ActivatedRoute);
  #timer = toSignal(timer(0, 500));

  params = toSignal(this.#activeRoute.params);
  queryParams = toSignal(this.#activeRoute.queryParams);

  
  randomNumber = computed(() => this.#timer() && Math.floor(Math.random() * 100));
  randomString = computed(() => this.#timer() && Math.random().toString(36).substring(2, 7));

}

@Component({
  selector: 'loop-url-state-child-route',
  standalone: true,
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <dl class="readout">
      <dt>Route Params</dt><dd>{{ params() | json }}</dd>
      <dt>Query Params</dt><dd>{{ queryParams() | json }}</dd>
    </dl>
  `,
})
export class UrlStateChildRouteComponent {
  #activeRoute = inject(ActivatedRoute);

  params = toSignal(this.#activeRoute.params);
  queryParams = toSignal(this.#activeRoute.queryParams);
}
