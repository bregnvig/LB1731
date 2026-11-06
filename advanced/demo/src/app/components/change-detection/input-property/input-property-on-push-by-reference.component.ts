import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { No } from '../change-detection.component';

@Component({
  selector: 'loop-input-property-on-push-by-reference',
  template: `
    <p class="cd-card on-push">
      <span class="strategy">OnPush</span>
      <span class="name">input-property-on-push component</span>
      <span class="badge bg-warning">{{no()?.value}}</span>
      <span class="actions">
        <button class="btn btn-sm btn-primary" (click)="noop()">Update UI</button>
      </span>
    </p>
  `,
  styles: `@import "src/app/components/change-detection/cd-card";`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPropertyOnPushByReferenceComponent {

  no = input<No>();

  noop() {
    console.log('Force change detection');
  }
}
