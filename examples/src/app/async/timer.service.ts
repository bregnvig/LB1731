
import {refCount, publish, shareReplay} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class TimerService {

  private timer$: Observable<Date>;

  constructor() {
    this.timer$ = new Observable(observer => {
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
      shareReplay({bufferSize: 1, refCount: true})
    );
  }

  public get timer(): Observable<Date> {
    return this.timer$;
  }
}
