import { Component, OnInit } from '@angular/core';

import { RotateFlyover2 } from '../rotate.directive';

@Component({
  selector: 'app-binding-attribute',
  templateUrl: 'binding-attribute.component.html',
  styleUrls: ['binding-attribute.component.css'],
  directives: [RotateFlyover2]
})
export class BindingAttributeComponent {

  public angle: number;


}
