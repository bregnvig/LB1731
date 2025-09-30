import { Component, input, OnInit } from '@angular/core';
import { interval, map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'loop-stop-watch',
  template: `
    {{(seconds$ | async)}} seconds
  `,
  standalone: false
})
export class StopWatchComponent implements OnInit {

  seconds$: Observable<number> = of(0);
  autoStart = input(false);
  isRunning = false;

  ngOnInit() {
    this.autoStart() && this.start();
  }

  start() {
    this.isRunning = true;
    this.seconds$ = interval(1000).pipe(map(seconds => seconds + 1), startWith(0));
  }

  stop() {
    this.isRunning = false;
    this.seconds$ = of(0);
  }

}
