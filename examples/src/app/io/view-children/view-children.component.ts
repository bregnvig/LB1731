import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
  selector: 'app-view-children',
  templateUrl: './view-children.component.html',
  styleUrls: ['./view-children.component.css']
})
export class ViewChildrenComponent implements OnInit {
  @ViewChildren(StopwatchComponent) stopwatches?: QueryList<StopwatchComponent>;
  @ViewChildren('stop1,stop2,stop3') stopwatchesString?: QueryList<StopwatchComponent>;

  constructor() { }

  ngOnInit() {
  }

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
