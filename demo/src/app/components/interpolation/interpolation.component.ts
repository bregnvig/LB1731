import { Component } from '@angular/core';

@Component({
  selector: 'app-interpolation',
  templateUrl: './interpolation.component.html',
  styleUrls: ['./interpolation.component.css'],
})
export class InterpolationComponent {

  protected propertyString = 'My property string!';
  protected propertyNumber = 17;
  protected propertyObject = {
    property: 'My object property'
  };
  protected propertyNull?: any = null;
  protected isCreating = false;

  protected simpleMethod() {
    return 'Simple method';
  }

  protected parameterMethod(string: string) {
    return `Hello ${string}`;
  }

}
