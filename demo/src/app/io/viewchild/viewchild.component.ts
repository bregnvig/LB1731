import { Component, ViewChild } from '@angular/core';

import { StopwatchComponent } from '../stopwatch';
import { StopwatchComponent as StopwatchComponent_1 } from '../stopwatch/stopwatch.component';

@Component({
    selector: 'app-viewchild',
    templateUrl: './viewchild.component.html',
    imports: [StopwatchComponent_1]
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
