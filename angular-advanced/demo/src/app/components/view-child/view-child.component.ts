import { AfterViewInit, Component, OnInit, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-child',
  templateUrl: './view-child.component.html',
  styleUrls: ['./view-child.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StopWatchComponent]
})
export class ViewChildComponent implements OnInit, AfterViewInit {

  stopWatch = viewChild.required(StopWatchComponent);
  running = true;

  // constructor() {
  //   this.start();
  // }

  ngOnInit() {
    this.start();
  }

  ngAfterViewInit() {
    // this.start();
  }

  start() {
    this.stopWatch().start();
    this.running = true;
  }
  stop() {
    this.stopWatch().stop();
    this.running = false;
  }
}
