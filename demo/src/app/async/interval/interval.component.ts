
import { interval, Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
@Component({
    selector: 'app-interval',
    templateUrl: './interval.component.html',
    imports: [AsyncPipe]
})
export class IntervalComponent implements OnInit {

  number$!: Observable<number>;

  ngOnInit() {
    this.number$ = interval(1000).pipe(take(10));
  }

}
