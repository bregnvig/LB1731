import { Component, OnInit } from '@angular/core';

import { RotateFlyover } from '../rotate.directive';

@Component({
    selector: 'app-user-event-attribute',
    template: `
      <h1>User event attribute</h1>
      <div class="pane-container center-content">
        <div class="pane fixed-size">
          <p rotateFlyover>
            My rotated text
          </p>
        </div>
      </div>
    `,
    imports: [RotateFlyover]
})
export class UserEventAttributeComponent {

}
