import { Component, OnInit, ViewChild } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
  selector: 'app-viewchild',
  templateUrl: 'viewchild.component.html',
  styleUrls: ['viewchild.component.css']
})
export class ViewchildComponent implements OnInit {

  @ViewChild(StopwatchComponent)
  public stopwatch: StopwatchComponent

  constructor() { }

  ngOnInit() {
  }

  public start() {
    this.stopwatch.start();
  }

  public stop() {
    this.stopwatch.stop();
  }

  public reset() {
    this.stopwatch.reset();
  }

}
