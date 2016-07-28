import { Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable()
export class StopwatchLoggerService {

  private intervalNo: number;
  public seconds: number = 0;

  constructor(private logger: LoggerService) {
   }

  public start() {
    this.logger.log('Stopwatch started');
    this.intervalNo = window.setInterval(() => this.seconds += 1, 1000);
  }

  public stop() {
    this.logger.log('Stopwatch stopped');
    window.clearInterval(this.intervalNo);
  } 

  public reset() {
    this.logger.log('Stopwatch resetted');
    this.stop();
    this.seconds = 0;
  }
}
