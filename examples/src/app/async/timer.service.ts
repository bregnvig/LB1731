
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';


@Injectable()
export class TimerService {

  private timer$: Observable<Date>;

  constructor() {
    this.timer$ = new Observable(observer => {
      const intervalId = window.setInterval(() => {
        console.log(new Date());
        observer.next(new Date());
      }, 1000);
      return () => {
        console.log('Stopping timer!');
        window.clearInterval(intervalId);
      };
    });
    // this.timer$ = interval(1000).pipe(
    //   map(() => {
    //     console.log(new Date());
    //     return new Date();
    //   }),
    //   finalize(() => console.log('Stopping timer'),
    //   )
    // );
  }

  get timer(): Observable<Date> {
    return this.timer$;
  }
}

@Injectable()
export class SharedTimerService {

  private timer$: Observable<Date>;

  constructor() {
    this.timer$ = new TimerService().timer.pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  get timer(): Observable<Date> {
    return this.timer$;
  }
}
