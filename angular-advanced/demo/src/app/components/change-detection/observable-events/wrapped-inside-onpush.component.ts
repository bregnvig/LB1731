import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ObservableEventsDefaultComponent } from './observable-events-default.component';

@Component({
  selector: 'loop-wrapped-inside-onpush',
  template: `
  <loop-observable-events-default/>
  `,
  styles: `
    @import "src/scss/variables";

    // The OnPush boundary drawn around the Eager child
    :host {
      position: relative;
      display: block;
      padding: 2.25rem .75rem .75rem;
      border: 2px dashed rgba($cobalt, .45);
      border-radius: $border-radius-xl;
      background: rgba($cobalt, .04);

      &::before {
        content: "OnPush";
        position: absolute;
        top: .5rem;
        left: 1rem;
        color: $cobalt;
        font-family: $font-family-monospace;
        font-size: .75rem;
        font-weight: 600;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ObservableEventsDefaultComponent]
})

export class WrappedInsideOnPushComponent {
}