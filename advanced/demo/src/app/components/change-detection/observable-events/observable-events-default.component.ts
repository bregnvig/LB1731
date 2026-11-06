import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Component({
  selector: 'loop-observable-events-default',
  template: `
    <p class="cd-card">
      <span class="strategy">Eager</span>
      <span class="name">Observable events default strategy</span>
      <span class="badge bg-success">{{no}}</span>
      <span class="actions">
        <button class="btn btn-sm btn-primary" type="button" (click)="start()">Start</button>
      </span>
    </p>
  `,
  styles: `@import "src/app/components/change-detection/cd-card";`,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class ObservableEventsDefaultComponent {

  no = 0;
  no$?: Observable<number>;
  running = false;

  start(): void {

    this.no$ = interval(1000).pipe(
      map(no => no + 1)
    );

    this.no$.subscribe(no => {
      this.no = no;
    });
    this.running = true;
  }

}
