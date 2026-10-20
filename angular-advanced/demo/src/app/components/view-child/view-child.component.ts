import { AfterViewInit, Component, OnInit, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { StopWatchComponent } from '../stop-watch/stop-watch.component';

@Component({
  selector: 'loop-view-child',
  template: `
    <div class="row">
      <div class="col">
        <loop-stop-watch />
      </div>
    </div>
    <div class="row">
      <div class="col-auto">
        <button class="btn btn-primary" [disabled]="running" (click)="start()">Start</button>
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" [disabled]="!running" (click)="stop()">Stop</button>
      </div>
    </div>
    `,
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
