import { Component, OnInit, ViewChild } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
  selector: 'app-viewchild',
  templateUrl: './viewchild.component.html',
  styleUrls: ['./viewchild.component.css']
})
export class ViewchildComponent implements OnInit {

  @ViewChild(StopwatchComponent, { static: true })
  stopwatch!: StopwatchComponent;

  constructor() { }

  ngOnInit() {
  }

  start() {
    console.log('Started!');
    this.stopwatch.start();
  }

  stop() {
    console.log('Stopped!');
    this.stopwatch.stop();
  }

  reset() {
    this.stopwatch.reset();
  }

}
