import { Person } from './../person';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-form-2',
  templateUrl: './person-form-2.component.html',
  styleUrls: ['./person-form-2.component.css']
})
export class PersonForm2Component implements OnInit {

  public colors = ["Red", "Green", "Blue"];
  public model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  constructor() { }

  ngOnInit() {
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

}
