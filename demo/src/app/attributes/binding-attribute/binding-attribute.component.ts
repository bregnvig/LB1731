import { Component } from '@angular/core';
import { RotateFlyover2 } from '../rotate.directive';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-binding-attribute',
  template: `
    <h1>Binding value attribute</h1>
    <div class="pane-container center-content">
      <div class="pane fixed-size">
        <input type="text" [(ngModel)]="angle">
        <p [rotateFlyover2]="angle">
          My rotated text
        </p>
      </div>
    </div>
  `,
  imports: [FormsModule, RotateFlyover2]
})
export class BindingAttributeComponent {

  protected angle: number = 0;
}
