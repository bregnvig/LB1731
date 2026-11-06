import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Component({
  selector: 'loop-observable-events',
  template: `
    <p class="cd-card on-push">
      <span class="strategy">OnPush</span>
      <span class="name">Observable events</span>
      <span class="badge bg-warning">{{no}}</span>
      <span class="actions">
        <button class="btn btn-sm btn-primary" type="button" (click)="start()">Start</button>
        <button class="btn btn-sm btn-primary" type="button" [disabled]="!running" (click)="noop()">Update UI</button>
      </span>
    </p>
  `,
  styles: `@import "src/app/components/change-detection/cd-card";`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservableEventsComponent {

  no = 0;
  no$?: Observable<number>;
  running = false;

  constructor() { }

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
