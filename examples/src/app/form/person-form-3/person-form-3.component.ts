import { Component, OnInit } from '@angular/core';

import { Person } from '../index';

@Component({
  selector: 'app-person-form-3',
  templateUrl: './person-form-3.component.html',
  styleUrls: ['./person-form-3.component.css']
})
export class PersonForm3Component implements OnInit {

  public colors = ["Red", "Green", "Blue"];
  public model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  constructor() { }

  ngOnInit() {
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

}
