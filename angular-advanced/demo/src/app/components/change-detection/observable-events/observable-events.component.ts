import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Component({
    selector: 'loop-observable-events',
    template: `
    <p>
      Observable events: <span class="badge bg-warning">{{no}}</span>
      <button class="btn btn-sm btn-primary mx-3" type="button" (click)="start()">Start</button>
      <button class="btn btn-sm btn-primary" type="button" [disabled]="!running" (click)="noop()">Update UI</button>
    </p>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ObservableEventsComponent {

  no = 0;
  no$?: Observable<number>;
  running = false;

  constructor(private cd: ChangeDetectorRef) { }

  start(): void {

    this.no$ = interval(1000).pipe(
      map(no => no + 1)
    );

    this.no$.subscribe(no => this.no = no);
    this.running = true;
  }

  noop() {
    console.log('Force change detection');
  }
}
