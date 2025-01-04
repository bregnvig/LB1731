import { Component } from '@angular/core';
import { RotateFlyover3 } from '../rotate.directive';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-bindings-attribute',
  templateUrl: './bindings-attribute.component.html',
  styleUrls: ['./bindings-attribute.component.css'],
  imports: [FormsModule, RotateFlyover3],
})
export class BindingsAttributeComponent {

  angle: number = 0;

}
