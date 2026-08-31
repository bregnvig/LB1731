
import { interval, Observable } from 'rxjs';

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { take } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
@Component({
    selector: 'app-interval',
    template: `
      <h2>Interval</h2>
      <p>{{number$ | async}}</p>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [AsyncPipe]
})
export class IntervalComponent implements OnInit {

  protected number$!: Observable<number>;

  ngOnInit() {
    this.number$ = interval(1000).pipe(take(10));
  }

}
