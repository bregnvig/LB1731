import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-child',
  templateUrl: './view-child.component.html',
  styleUrls: ['./view-child.component.scss']
})
export class ViewChildComponent implements OnInit, AfterViewInit {

  @ViewChild(StopWatchComponent, { static: true }) stopWatch!: StopWatchComponent;
  running = true;

  ngOnInit() {
    // this.stopWatch.start();
  }

  ngAfterViewInit() {
    // this.stopWatch.start();

  }

  start() {
    this.stopWatch.start();
    this.running = true;
  }
  stop() {
    this.stopWatch.stop();
    this.running = false;
  }
}
