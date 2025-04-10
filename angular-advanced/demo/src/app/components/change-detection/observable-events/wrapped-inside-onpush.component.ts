import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'loop-wrapped-inside-onpush',
  template: `
  <loop-observable-events-default/>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WrappedInsideOnPushComponent {
}