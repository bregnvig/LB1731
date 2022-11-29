import { Person } from './../person';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-form-3',
  templateUrl: './person-form-3.component.html',
})
export class PersonForm3Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  get diagnostic() {
    return JSON.stringify(this.model);
  }

}
