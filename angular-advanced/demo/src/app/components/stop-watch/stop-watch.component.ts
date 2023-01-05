import { Component, Input, OnInit } from '@angular/core';
import { interval, map, Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'loop-stop-watch',
  template: `
    {{(seconds$ | async)}} seconds
  `,
})
export class StopWatchComponent implements OnInit {

  seconds$: Observable<number> = of(0);
  @Input() autoStart = false;

  ngOnInit() {
    this.autoStart && this.start();
  }

  start() {
    this.seconds$ = interval(1000).pipe(map(seconds => seconds + 1), startWith(0));
  }

  stop() {
    this.seconds$ = of(0);
  }

}
