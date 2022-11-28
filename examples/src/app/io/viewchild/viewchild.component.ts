import { Component, ViewChild } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';

@Component({
  selector: 'app-viewchild',
  templateUrl: './viewchild.component.html',
})
export class ViewchildComponent {

  @ViewChild(StopwatchComponent, { static: true })
  stopwatch!: StopwatchComponent;

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
