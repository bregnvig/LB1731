import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'loop-input-property-on-push-simple-type',
  template: `
    <p>
      input-property-on-push-simple-type component {{no}}!
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPropertyOnPushSimpleTypeComponent {

  @Input() no: number | undefined;
}
