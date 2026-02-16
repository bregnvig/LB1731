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

  protected start() {
    console.log('Started!');
    this.stopwatch.start();
  }

  protected stop() {
    console.log('Stopped!');
    this.stopwatch.stop();
  }

  protected reset() {
    this.stopwatch.reset();
  }

}
