import { Component, OnInit } from '@angular/core';

import { Rotate180 } from '../rotate.directive';

@Component({
    selector: 'app-simple-attribute',
    template: `
      <h1>Simple attribute</h1>
      <div class="pane-container center-content">
        <div class="pane fixed-size">
          <p rotate180>
            My rotated text
          </p>
        </div>
      </div>
    `,
    imports: [Rotate180]
})
export class SimpleAttributeComponent {
}
