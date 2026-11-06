import { Component } from '@angular/core';
import { RotateFlyover3 } from '../rotate.directive';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-bindings-attribute',
  template: `
    <h1>Bindings value attribute</h1>
    <div class="pane-container center-content">
      <div class="pane fixed-size">
        <input type="text" [(ngModel)]="angle">
        <p [rotateFlyover3]="angle" [defaultAngle]="17">
          My rotated text
        </p>
      </div>
    </div>
  `,
  imports: [FormsModule, RotateFlyover3],
})
export class BindingsAttributeComponent {

  protected angle: number = 0;

}
