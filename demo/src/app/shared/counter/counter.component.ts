import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CounterService } from '../counter.service';

@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <h2>Provided</h2>
    <p>{{counterService.count}}</p>
    <button class="btn btn-primary" type="button" (click)="increment()">Tæl op</button>
  `,
})
export class CounterComponent {

  protected counterService = inject(CounterService);

  protected increment() {
    this.counterService.increment();
  }

}
