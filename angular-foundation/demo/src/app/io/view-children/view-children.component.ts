import { Component, viewChildren } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
    selector: 'app-view-children',
    template: `
      <h2>viewChildren</h2>
      <h3 class="row g-3">
        <app-stopwatch class="col-auto"/>
        <app-stopwatch class="col-auto"/>
        <app-stopwatch class="col-auto"/>
      </h3>
      <div>
        <button class="btn btn-success" (click)="start()">Start</button>
        <button class="btn btn-default" (click)="stop()">Stop</button>
        <button class="btn btn-danger" (click)="reset()">Reset</button>
      </div>

      <hr>

        @for (i of [0,2,3]; track i) {
          <p>
            Loop {{i}}
            <app-stopwatch/>
          </p>
        }

        <hr>

          <h3 class="row g-3">
            <app-stopwatch class="col-auto" #stop1/>
            <app-stopwatch class="col-auto" #stop2/>
            <app-stopwatch class="col-auto" #stop3/>
          </h3>

          <div>
            <button class="btn btn-success" (click)="startString()">Start</button>
            <button class="btn btn-default" (click)="stopString()">Stop</button>
            <button class="btn btn-danger" (click)="resetString()">Reset</button>
          </div>
    `,
    imports: [StopwatchComponent]
})
export class ViewChildrenComponent {

  readonly stopwatches = viewChildren(StopwatchComponent);
  readonly stopwatchesString = viewChildren<StopwatchComponent>('stop1,stop2,stop3');

  protected start() {
    this.stopwatches().forEach(child => child.start());
  }

  protected stop() {
    this.stopwatches().forEach(child => child.stop());
  }

  protected reset() {
    this.stopwatches().forEach(child => child.reset());
  }

  protected startString() {
    this.stopwatchesString().forEach(child => child.start());
  }

  protected stopString() {
    this.stopwatchesString().forEach(child => child.stop());
  }

  protected resetString() {
    this.stopwatchesString().forEach(child => child.reset());
  }

}
