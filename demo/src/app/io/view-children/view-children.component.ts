import { Component, QueryList, ViewChildren } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

import { StopwatchComponent as StopwatchComponent_1 } from '../stopwatch/stopwatch.component';

@Component({
    selector: 'app-view-children',
    templateUrl: './view-children.component.html',
    imports: [StopwatchComponent_1]
})
export class ViewChildrenComponent {
  @ViewChildren(StopwatchComponent) stopwatches?: QueryList<StopwatchComponent>;
  @ViewChildren('stop1,stop2,stop3') stopwatchesString?: QueryList<StopwatchComponent>;

  protected start() {
    this.stopwatches?.forEach((child) => child.start());
  }

  protected stop() {
    this.stopwatches?.forEach((child) => child.stop());
  }

  protected reset() {
    this.stopwatches?.forEach((child) => child.reset());
  }

  protected startString() {
    this.stopwatchesString?.forEach((child) => child.start());
  }

  protected stopString() {
    this.stopwatchesString?.forEach((child) => child.stop());
  }

  protected resetString() {
    this.stopwatchesString?.forEach((child) => child.reset());
  }


}
