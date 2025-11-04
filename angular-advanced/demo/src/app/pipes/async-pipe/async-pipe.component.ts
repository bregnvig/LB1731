import { formatDate } from '@angular/common';
import { Component, inject, LOCALE_ID } from '@angular/core';
import { timer } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'loop-async-pipe',
  template: `
    @if (date$ | async; as now) {
      <p>
        {{now | date: 'HH:mm:ss'}}
      </p>
    }
    @if (date) {
      <p>
        {{date | date: 'HH:mm:ss'}}
      </p>
    }
    `,
  standalone: false
})
export class AsyncPipeComponent {

  #localeId = inject(LOCALE_ID);
  date$ = timer(0, 1000).pipe(
    map(() => new Date()),
    tap(_ => console.log(formatDate(_, 'HH:mm:ss', this.#localeId))),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  date: Date | undefined;

  constructor() {
    this.date$.subscribe(date => this.date = date);
  }

}
