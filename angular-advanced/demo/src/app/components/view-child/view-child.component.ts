import { Component, ViewChild } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-child',
  templateUrl: './view-child.component.html',
  styleUrls: ['./view-child.component.scss']
})
export class ViewChildComponent {

  @ViewChild(StopWatchComponent) stopWatch: StopWatchComponent | undefined;

  start() {
    this.stopWatch?.start();
  }
  stop() {
    this.stopWatch?.stop();
  }
}
