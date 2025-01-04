import { Component } from '@angular/core';
import { CounterService } from '../counter.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
})
export class CounterComponent {

  constructor(public counterService: CounterService) { }

  increment() {
    this.counterService.increment();
  }

}
