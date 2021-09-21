import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'loop-observable-events',
  template: `
    <p>
      Observable events: {{no}}
      <button class="btn btn-sm btn-primary" type="button" (click)="noop()">Update UI</button>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableEventsComponent implements OnInit {

  no = 0;

  constructor() { }

  ngOnInit(): void {
    interval(1000).subscribe(no => this.no = no + 1);
  }

  noop() {
    console.log('Force change detection');
  }
}
