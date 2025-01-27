import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'loop-input-property-on-push-simple-type',
    template: `
    <p>
      input-property-on-push-simple-type component <span class="badge bg-success">{{no}}</span>!
    </p>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class InputPropertyOnPushSimpleTypeComponent {

  @Input() no?: number;
}
