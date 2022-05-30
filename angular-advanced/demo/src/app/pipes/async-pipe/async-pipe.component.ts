import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'loop-async-pipe',
  template: `
    <span *ngIf="date$ | async as now">  
      {{now | date: 'HH:mm:ss'}}
    </span>
  `,
  // template: `{{date  | date: 'HH:mm:ss'}}`,
  providers: [DatePipe]
})
export class AsyncPipeComponent implements OnInit {

  date$ = interval(1000).pipe(startWith(new Date()), map(() => new Date()), tap(_ => console.log(this.datePipe.transform(_, 'HH:mm:ss'))));
  // date: Date | undefined;

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    // this.date$.subscribe(date => this.date = date);
  }

}
