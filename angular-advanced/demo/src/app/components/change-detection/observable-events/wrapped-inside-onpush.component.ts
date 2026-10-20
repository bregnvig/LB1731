import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ObservableEventsDefaultComponent } from './observable-events-default.component';

@Component({
  selector: 'loop-wrapped-inside-onpush',
  template: `
  <loop-observable-events-default/>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ObservableEventsDefaultComponent]
})

export class WrappedInsideOnPushComponent {
}