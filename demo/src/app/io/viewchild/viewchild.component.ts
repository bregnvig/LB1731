import { Component, ViewChild } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';
import { StopwatchComponent as StopwatchComponent_1 } from '../stopwatch/stopwatch.component';

@Component({
    selector: 'app-viewchild',
    template: `
      <h2>&#64;ViewChild</h2>
      <h3>
        <app-stopwatch/>
      </h3>
      <div>
        <button class="btn btn-success" (click)="start()">Start</button>
        <button class="btn btn-default" (click)="stop()">Stop</button>
        <button class="btn btn-danger" (click)="reset()">Reset</button>
      </div>
    `,
    imports: [StopwatchComponent_1]
})
export class ViewchildComponent {

  @ViewChild(StopwatchComponent, { static: true })
  stopwatch!: StopwatchComponent;

  protected start() {
    console.log('Started!');
    this.stopwatch.start();
  }

  protected stop() {
    console.log('Stopped!');
    this.stopwatch.stop();
  }

  protected reset() {
    this.stopwatch.reset();
  }

}
