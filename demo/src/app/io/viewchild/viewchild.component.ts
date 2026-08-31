import { Component, viewChild, ChangeDetectionStrategy } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
    selector: 'app-viewchild',
    template: `
      <h2>viewChild</h2>
      <h3>
        <app-stopwatch/>
      </h3>
      <div>
        <button class="btn btn-success" (click)="start()">Start</button>
        <button class="btn btn-default" (click)="stop()">Stop</button>
        <button class="btn btn-danger" (click)="reset()">Reset</button>
      </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [StopwatchComponent]
})
export class ViewchildComponent {

  readonly stopwatch = viewChild.required(StopwatchComponent);

  protected start() {
    console.log('Started!');
    this.stopwatch().start();
  }

  protected stop() {
    console.log('Stopped!');
    this.stopwatch().stop();
  }

  protected reset() {
    this.stopwatch().reset();
  }

}
