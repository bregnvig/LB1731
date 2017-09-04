import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  template: '{{seconds}}',
  styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnInit, OnDestroy {

  public seconds: number = 0;
  private intervalNo: number;

  constructor() { }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.stop();
  }

  public start() {
    this.intervalNo = window.setInterval(() => {
      console.log(this.seconds);
      this.seconds += 1
    }, 1000);
  }

  public stop() {
    window.clearInterval(this.intervalNo);
  }

  public reset() {
    this.stop();
    this.seconds = 0;
  }

}
