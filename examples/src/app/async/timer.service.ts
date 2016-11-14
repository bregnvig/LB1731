import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publish';

@Injectable()
export class TimerService {

  private timerStream: Observable<Date>;

  constructor() {
    this.timerStream = Observable
      .create(observer => {
        const intervalId = window.setInterval(() => {
          observer.next(new Date())
        } , 1000);
        return () => {
          console.log('Stopping timer!');
          window.clearInterval(intervalId);
        }
      });
  }

  public get timer(): Observable<Date> {
    return this.timerStream;
  }
}

@Injectable()
export class SharedTimerService {

  private timerStream: Observable<Date>;

  constructor() {
    this.timerStream = Observable
      .create(observer => {
        const intervalId = window.setInterval(() => {
          console.log('SharedTimer', new Date());
          observer.next(new Date())
        }, 1000);
        return () => {
          console.log('Stopping timer!');
          window.clearInterval(intervalId);
        }
      })
      .publish()
      .refCount();
  }

  public get timer(): Observable<Date> {
    return this.timerStream;
  }
}
