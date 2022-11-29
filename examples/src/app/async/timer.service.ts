
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';


@Injectable()
export class TimerService {

  private timer$: Observable<Date>;

  constructor() {
    this.timer$ = new Observable(observer => {
      const intervalId = window.setInterval(() => {
        observer.next(new Date());
      }, 1000);
      return () => {
        window.clearInterval(intervalId);
      };
    });
    // this.timer$ = interval(1000).pipe(
    //   map(() => new Date())
    // );
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
