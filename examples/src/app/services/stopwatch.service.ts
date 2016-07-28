import { Injectable } from '@angular/core';

@Injectable()
export class StopwatchService {

  private intervalNo: number;
  public seconds: number = 0;

  constructor() {
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
