import { Component } from '@angular/core';
import { Person } from './../person';

@Component({
  selector: 'app-person-form-4',
  templateUrl: './person-form-4.component.html',
})
export class PersonForm4Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('', '', '');

  get diagnostic() {
    return JSON.stringify(this.model);
  }


}
