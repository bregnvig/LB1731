import { Component, OnInit, ViewChild } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
  selector: 'app-viewchild',
  templateUrl: './viewchild.component.html',
  styleUrls: ['./viewchild.component.css']
})
export class ViewchildComponent implements OnInit {

  @ViewChild(StopwatchComponent, { static: true })
  public stopwatch: StopwatchComponent

  constructor() { }

  ngOnInit() {
  }

  public start() {
    console.log('Started!');
    this.stopwatch.start();
  }

  public stop() {
    console.log('Stopped!');
    this.stopwatch.stop();
  }

  public reset() {
    this.stopwatch.reset();
  }

}
