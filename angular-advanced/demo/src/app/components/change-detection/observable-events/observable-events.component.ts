import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval } from 'rxjs';

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
})
export class ObservableEventsComponent {

  no = 0;
  running = false;

  constructor() { }

  start(): void {
    interval(1000).subscribe(no => this.no = no + 1);
    this.running = true;
  }

  noop() {
    console.log('Force change detection');
  }
}
