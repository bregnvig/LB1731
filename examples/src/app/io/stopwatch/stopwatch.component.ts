import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  template: '{{seconds}}',
  styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnInit {

  public seconds: number = 0;
  private intervalNo: number;

  constructor() { }

  ngOnInit() {
  }

  public start() {
    this.intervalNo = window.setInterval(() => this.seconds += 1, 1000);
  }

  public stop() {
    window.clearInterval(this.intervalNo);
  }

  public reset() {
    this.stop();
    this.seconds = 0;
  }

}
