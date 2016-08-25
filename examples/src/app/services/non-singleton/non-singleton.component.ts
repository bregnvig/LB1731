import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../stopwatch.service';

@Component({
  selector: 'app-non-singleton-stopwatch',
  template: `
    <p>
      {{stopwatch.seconds}}
    </p>
    <p>
      <button class="btn btn-success" (click)="stopwatch.start()">Start</button>
      <button class="btn btn-default" (click)="stopwatch.stop()">Stop</button>
      <button class="btn btn-danger" (click)="stopwatch.reset()">Reset</button>
    </p>
  `,
  providers: [StopwatchService]
})
export class StopwatchNonSingletonComponent {
  constructor(public stopwatch: StopwatchService) {
  }
}

@Component({
  moduleId: module.id,
  selector: 'app-non-singleton',
  templateUrl: 'non-singleton.component.html',
  styleUrls: ['non-singleton.component.css']
})
export class NonSingletonComponent {

}
