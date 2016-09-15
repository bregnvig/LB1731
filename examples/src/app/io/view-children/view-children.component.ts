import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
  selector: 'app-view-children',
  templateUrl: 'view-children.component.html',
  styleUrls: ['view-children.component.css']
})
export class ViewChildrenComponent implements OnInit {
  @ViewChildren(StopwatchComponent) stopwatches: QueryList<StopwatchComponent>;
  @ViewChildren('stop1,stop2,stop3') stopwatchesString: QueryList<StopwatchComponent>;

  constructor() { }

  ngOnInit() {
  }

  public start() {
    this.stopwatches.forEach((child) => child.start());
  }

  public stop() {
    this.stopwatches.forEach((child) => child.stop());
  }

  public reset() {
    this.stopwatches.forEach((child) => child.reset());
  }

  public startString() {
    this.stopwatchesString.forEach((child) => child.start());
  }

  public stopString() {
    this.stopwatchesString.forEach((child) => child.stop());
  }

  public resetString() {
    this.stopwatchesString.forEach((child) => child.reset());
  }


}
