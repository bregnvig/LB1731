import { Component, OnInit } from '@angular/core';

import { Person } from '../index';


@Component({
  selector: 'app-person-form-1',
  templateUrl: 'person-form-1.component.html',
  styleUrls: ['person-form-1.component.css']
})
export class PersonForm1Component implements OnInit {

  public colors = ["Red", "Green", "Blue"];
  public model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  constructor() { }

  ngOnInit() {
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  logValue(value:any) {
    console.log('Value', value);
    
  }
}
