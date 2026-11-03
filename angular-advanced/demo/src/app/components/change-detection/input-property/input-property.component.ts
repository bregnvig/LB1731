import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { No } from '../change-detection.component';

@Component({
  selector: 'loop-input-property',
  template: `
    <p class="cd-card">
      <span class="strategy">Eager</span>
      <span class="name">input-property component</span>
      <span class="badge bg-success">{{no()?.value}}</span>
    </p>
  `,
  styles: `@import "src/app/components/change-detection/cd-card";`,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class InputPropertyComponent {

  no = input<No>();

}
