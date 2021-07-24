import { Component } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'loop-stop-watch',
  template: `
    {{(seconds$ | async)}} seconds
  `,
})
export class StopWatchComponent {

  seconds$: Observable<number> = of(0);

  start() {
    this.seconds$ = interval(1000).pipe(map(seconds => seconds + 1), startWith(0));
  }

  stop() {
    this.seconds$ = of(0);
  }

}
