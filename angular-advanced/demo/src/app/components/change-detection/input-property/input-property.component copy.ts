import { Component, Input } from '@angular/core';
import { No } from '../change-detection.component';

@Component({
  selector: 'loop-input-property',
  template: `
    <p>
      input-property component {{no?.value}}!
    </p>
  `,
})
export class InputPropertyComponent {

  @Input() no: No | undefined;

}
