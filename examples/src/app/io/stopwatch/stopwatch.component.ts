import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  template: '{{seconds}}',
  styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnInit, OnDestroy {

  seconds: number = 0;
  private intervalNo: number;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('Destroyed');
    this.stop();
  }

  start() {
    this.intervalNo = window.setInterval(() => {
      console.log(this.seconds);
      this.seconds += 1;
    }, 1000);
  }

  stop() {
    window.clearInterval(this.intervalNo);
  }

  reset() {
    this.stop();
    this.seconds = 0;
  }

}
