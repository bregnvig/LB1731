import { DatePipe } from '@angular/common';
import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { RouteProvidedService } from './route-provided.service';

@Component({
  selector: 'loop-lazy-loaded',
  imports: [DatePipe],
  template: `
  <div class="demo-surface">
    <small>RouteProvidedService.time</small>
    {{service.time | date: 'medium'}}
  </div>
  `,
  styles: `
    .demo-surface { display: grid; place-items: center; gap: .5rem; padding: 3.5rem 2rem;
      font-size: 2.75rem; font-weight: 650; font-stretch: 75%; font-variant-numeric: tabular-nums; }
    small { font: 500 .875rem var(--bs-font-monospace); opacity: .8; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'da',
    },
  ]
})

export class LazyLoadedComponent {

  service = inject(RouteProvidedService);
}