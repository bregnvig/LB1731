import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../stopwatch.service';

@Component({
  selector: 'app-singleton-stopwatch',
  template: `
    <p>
      {{stopwatch.seconds}}
    </p>
    <p>
      <button class="btn btn-success" (click)="stopwatch.start()">Start</button>
      <button class="btn btn-default" (click)="stopwatch.stop()">Stop</button>
      <button class="btn btn-danger" (click)="stopwatch.reset()">Reset</button>
    </p>
  `
})
export class StopwatchSingletonComponent {
  constructor(public stopwatch: StopwatchService) {

  }
}

@Component({
  selector: 'app-singleton',
  templateUrl: 'singleton.component.html',
  styleUrls: ['singleton.component.css'],
  providers: [StopwatchService]
})
export class SingletonComponent {
}
