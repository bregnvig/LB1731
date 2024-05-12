import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'loop-async-pipe',
  template: `
    @if (date$ | async; as now) {
      <p>
        {{now | date: 'HH:mm:ss'}}
      </p>
    }
    @if (date$ | async; as now) {
      <p>
        {{now | date: 'HH:mm:ss'}}
      </p>
    }
    `,
  // template: `{{date  | date: 'HH:mm:ss'}}`,
  providers: [DatePipe]
})
export class AsyncPipeComponent implements OnInit {

  date$ = timer(0, 1000).pipe(
    map(() => new Date()), tap(_ => console.log(this.datePipe.transform(_, 'HH:mm:ss'))),
    // shareReplay({ bufferSize: 1, refCount: true })
  );
  // date: Date | undefined;

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    // this.date$.subscribe(date => this.date = date);
  }

}
