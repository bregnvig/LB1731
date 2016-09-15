import { Component, OnInit } from '@angular/core';

import { RotateFlyover3 } from '../rotate.directive';

@Component({
  selector: 'app-bindings-attribute',
  templateUrl: 'bindings-attribute.component.html',
  styleUrls: ['bindings-attribute.component.css'],
  directives: [RotateFlyover3]
})
export class BindingsAttributeComponent {

  public angle: number;

}
