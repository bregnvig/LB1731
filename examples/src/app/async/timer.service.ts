
import {refCount, publish} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class TimerService {

  private timer$: Observable<Date>;

  constructor() {
    this.timer$ = Observable
      .create(observer => {
        const intervalId = window.setInterval(() => {
          console.log(new Date());
          observer.next(new Date())
        }, 1000);
        return () => {
          console.log('Stopping timer!');
          window.clearInterval(intervalId);
        }
      });
  }

  public get timer(): Observable<Date> {
    return this.timer$;
  }
}

@Injectable()
export class SharedTimerService {

  private timer$: Observable<Date>;

  constructor() {
    this.timer$ = new TimerService().timer.pipe(
      publish(),
      refCount(),
    );
  }

  public get timer(): Observable<Date> {
    return this.timer$;
  }
}
