import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-interpolation',
  templateUrl: 'interpolation.component.html',
  styleUrls: ['interpolation.component.css']
})
export class InterpolationComponent implements OnInit {

  public propertyString = 'Property string!';
  public propertyNumber = 17;
  public propertyObject = {
    property: 'Object property'
  };
  public propertyNull = null;

  constructor() { }

  ngOnInit() {
  }

  public simpleMethod() {
    return 'Simple method'
  }

  public parameterMethod(string: string) {
    return `Hello ${string}`;
  }

}
