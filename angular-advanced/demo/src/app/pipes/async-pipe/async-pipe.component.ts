import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
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
})
export class AsyncPipeComponent implements OnInit {

  date$ = timer(0, 1000).pipe(
    map(() => new Date()), tap(_ => console.log(formatDate(_, 'HH:mm:ss', this.localeId))),
    // shareReplay({ bufferSize: 1, refCount: true })
  );
  // date: Date | undefined;

  constructor(@Inject(LOCALE_ID) private localeId: string) { }

  ngOnInit(): void {
    // this.date$.subscribe(date => this.date = date);
  }

}
