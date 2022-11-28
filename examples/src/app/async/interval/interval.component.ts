
import { interval as observableInterval, Observable } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.css']
})
export class IntervalComponent implements OnInit {

  number$!: Observable<number>;

  ngOnInit() {
    this.number$ = observableInterval(1000).pipe(take(10));
  }

}
