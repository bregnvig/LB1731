import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interpolation',
  templateUrl: './interpolation.component.html',
  styleUrls: ['./interpolation.component.css']
})
export class InterpolationComponent implements OnInit {

   propertyString = 'Property string!';
   propertyNumber = 17;
   propertyObject = {
    property: 'Object property'
  };
   propertyNull = null;

  constructor() { }

  ngOnInit() {
  }

   simpleMethod() {
    return 'Simple method'
  }

   parameterMethod(string: string) {
    return `Hello ${string}`;
  }

}
