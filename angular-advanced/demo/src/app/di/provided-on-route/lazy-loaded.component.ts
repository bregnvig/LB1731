import { DatePipe } from '@angular/common';
import { Component, inject, LOCALE_ID } from '@angular/core';
import { RouteProvidedService } from './route-provided.service';

@Component({
  selector: 'loop-lazy-loaded',
  imports: [DatePipe],
  template: `
  {{service.time | date: 'medium'}}
  `,
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'da',
    }
  ]
})

export class LazyLoadedComponent {

  service = inject(RouteProvidedService);
}