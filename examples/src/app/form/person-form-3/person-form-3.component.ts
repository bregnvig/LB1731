import { Person } from './../person';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-form-3',
  templateUrl: './person-form-3.component.html',
  styleUrls: ['./person-form-3.component.css']
})
export class PersonForm3Component implements OnInit {

   colors = ["Red", "Green", "Blue"];
   model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  constructor() { }

  ngOnInit() {
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

}
