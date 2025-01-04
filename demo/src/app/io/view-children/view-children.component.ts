import { Component, QueryList, ViewChildren } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';
import { NgFor } from '@angular/common';
import { StopwatchComponent as StopwatchComponent_1 } from '../stopwatch/stopwatch.component';

@Component({
    selector: 'app-view-children',
    templateUrl: './view-children.component.html',
    imports: [StopwatchComponent_1, NgFor]
})
export class ViewChildrenComponent {
  @ViewChildren(StopwatchComponent) stopwatches?: QueryList<StopwatchComponent>;
  @ViewChildren('stop1,stop2,stop3') stopwatchesString?: QueryList<StopwatchComponent>;

  start() {
    this.stopwatches?.forEach((child) => child.start());
  }

  stop() {
    this.stopwatches?.forEach((child) => child.stop());
  }

  reset() {
    this.stopwatches?.forEach((child) => child.reset());
  }

  startString() {
    this.stopwatchesString?.forEach((child) => child.start());
  }

  stopString() {
    this.stopwatchesString?.forEach((child) => child.stop());
  }

  resetString() {
    this.stopwatchesString?.forEach((child) => child.reset());
  }


}
