import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'loop-input-property-on-push-simple-type',
    template: `
    <p class="cd-card on-push">
      <span class="strategy">OnPush</span>
      <span class="name">input-property-on-push-simple-type component</span>
      <span class="badge bg-success">{{no()}}</span>
    </p>
  `,
    styles: `@import "src/app/components/change-detection/cd-card";`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPropertyOnPushSimpleTypeComponent {

  no = input<number>();
}
