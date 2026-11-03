import { formatDate } from '@angular/common';
import { Component, inject, LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'loop-async-pipe',
  template: `
    <div class="demo-surface">
      @if (date$ | async; as now) {
        <p>
          <small>date$ | async</small>
          {{now | date: 'HH:mm:ss'}}
        </p>
      }
      @if (date) {
        <p>
          <small>date (subscribe)</small>
          {{date | date: 'HH:mm:ss'}}
        </p>
      }
    </div>
    `,
  styles: `
    .demo-surface { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1rem; }
    p { display: grid; gap: .25rem; margin: 0; padding: 1.5rem; border-radius: 1rem; background: rgba(255, 255, 255, .14);
      font: 600 3rem var(--bs-font-monospace); font-variant-numeric: tabular-nums; }
    small { font-size: .8125rem; font-weight: 500; opacity: .8; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AsyncPipeComponent {

  #localeId = inject(LOCALE_ID);
  date$ = timer(0, 1000).pipe(
    map(() => new Date()),
    tap(_ => console.log(formatDate(_, 'HH:mm:ss', this.#localeId))),
    // shareReplay({ bufferSize: 1, refCount: true })
  );
  date: Date | undefined;

  constructor() {
    this.date$.subscribe(date => this.date = date);
  }

}
