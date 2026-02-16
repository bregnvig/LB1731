import { Component, inject } from '@angular/core';
import { CounterService } from '../counter.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
})
export class CounterComponent {

  protected counterService = inject(CounterService);

  protected increment() {
    this.counterService.increment();
  }

}
