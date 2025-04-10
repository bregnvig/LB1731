import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Component({
  selector: 'loop-observable-events-default',
  template: `
    <p>
      Observable events default strategy: <span class="badge bg-success">{{no}}</span>
      <button class="btn btn-sm btn-primary mx-3" type="button" (click)="start()">Start</button>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
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
