import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { No } from '../change-detection.component';

@Component({
  selector: 'loop-input-property-on-push-by-reference',
  template: `
    <p>
      input-property-on-push component {{no?.value}}!
      <button class="btn btn-sm btn-primary" (click)="noop()">Update UI</button>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputPropertyOnPushByReferenceComponent {

  @Input() no: No | undefined;

  noop() {
    console.log('Force change detection');
  }
}
