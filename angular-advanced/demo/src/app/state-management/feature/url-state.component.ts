import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'loop-url-state',
  standalone: true,
  imports: [JsonPipe, RouterOutlet, RouterLink],
  template: `
    <div>
      <h2>Change URL State</h2>
      <div class="d-flex flex-column gap-2">
        <div>
          <a class="btn btn-primary" [routerLink]="[]" [queryParams]="{ a: randomStringFn(), b: randomStringFn() }" queryParamsHandling="merge">
            Navigate with query params
          </a>
        </div>
        <div>
          <a class="btn btn-primary" [routerLink]="[{parentMatrixKey: randomStringFn()}]" queryParamsHandling="merge">
            Navigate with placeholder and matrix params
          </a>
        </div>
        <div>
          <a class="btn btn-primary" [routerLink]="['child-route', randomNumberFn(), {childMatrixKey: randomStringFn()}]" queryParamsHandling="merge">
            Navigate with child-route placeholder and matrix params
          </a>
        </div>
      </div>

      <hr>
      <h2 class="mt-4">UrlStateComponent</h2>
      <p>Route Params: {{ params() | json }}</p>
      <p>Query Params: {{ queryParams() | json }}</p>
      
      <hr>
      <h2 class="mt-4">UrlStateChildRouteComponent</h2>
      <router-outlet></router-outlet>

      
    </div>
  `,
})
export class UrlStateComponent {
  #activeRoute = inject(ActivatedRoute);
  #router = inject(Router);

  params = toSignal(this.#activeRoute.params);
  queryParams = toSignal(this.#activeRoute.queryParams);

  randomNumberFn = () => Math.floor(Math.random() * 100);
  randomStringFn = () => Math.random().toString(36).substring(2, 7);

  queryParamsInnerText = `[routerLink]=\"[]\" [queryParams]=\"{ a: randomStringFn(), b: randomStringFn() }\" queryParamsHandling=\"merge\"`;

  navigateToChildWithMatrix() {
    this.#router.navigate(['child-route', { matrixKey: 'matrixValue' }], {
      relativeTo: this.#activeRoute,
      queryParamsHandling: 'preserve',
    });
  }
}

@Component({
  selector: 'loop-url-state-child-route',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div>
      <p>Route Params: {{ params() | json }}</p>
      <p>Query Params: {{ queryParams() | json }}</p>
    </div>
  `,
})
export class UrlStateChildRouteComponent {
  #activeRoute = inject(ActivatedRoute);

  params = toSignal(this.#activeRoute.params);
  queryParams = toSignal(this.#activeRoute.queryParams);
}
