import { Person } from './../person';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-form-4',
  templateUrl: './person-form-4.component.html',
  styleUrls: ['./person-form-4.component.css']
})
export class PersonForm4Component implements OnInit {

   colors = ["Red", "Green", "Blue"];
   model = new Person('', '', '');

  constructor() { }

  ngOnInit() {
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }


}
