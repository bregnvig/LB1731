import { Component, OnInit, ViewChild } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-child',
  templateUrl: './view-child.component.html',
  styleUrls: ['./view-child.component.scss']
})
export class ViewChildComponent implements OnInit {

  @ViewChild(StopWatchComponent, { static: true }) stopWatch!: StopWatchComponent;

  ngOnInit() {
    this.stopWatch.start();
  }

  start() {
    this.stopWatch.start();
  }
  stop() {
    this.stopWatch.stop();
  }
}
