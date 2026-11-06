import { Component, viewChildren } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
    selector: 'app-view-children',
    templateUrl: './view-children.component.html',
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
