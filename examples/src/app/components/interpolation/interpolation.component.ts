import { Component } from '@angular/core';

@Component({
  selector: 'app-interpolation',
  templateUrl: './interpolation.component.html',
  styleUrls: ['./interpolation.component.css']
})
export class InterpolationComponent {

  propertyString = 'My property string!';
  propertyNumber = 17;
  propertyObject = {
    property: 'My object property'
  };
  propertyNull = null;

  simpleMethod() {
    return 'Simple method';
  }

  parameterMethod(string: string) {
    return `Hello ${string}`;
  }

}
