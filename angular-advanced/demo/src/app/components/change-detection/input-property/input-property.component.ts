import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { No } from '../change-detection.component';

@Component({
    selector: 'loop-input-property',
    template: `
    <p>
      input-property component <span class="badge bg-success">{{no?.value}}</span>
    </p>
  `,
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class InputPropertyComponent {

  @Input() no?: No;

}
