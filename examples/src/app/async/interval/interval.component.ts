import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-interval',
  templateUrl: './interval.component.html',
  styleUrls: ['./interval.component.css']
})
export class IntervalComponent implements OnInit {

  public number$: Observable<number>;

  constructor() { }

  ngOnInit() {
    this.number$ = Observable.interval(1000).take(10);
  }

}
