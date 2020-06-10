
import {interval as observableInterval,  Observable } from 'rxjs';

import {take} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.css']
})
export class IntervalComponent implements OnInit {

   number$: Observable<number>;

  constructor() { }

  ngOnInit() {
    this.number$ = observableInterval(1000).pipe(take(10));
  }

}
