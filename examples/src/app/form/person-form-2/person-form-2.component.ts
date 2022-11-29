import { Component } from '@angular/core';
import { Person } from './../person';

@Component({
  selector: 'app-person-form-2',
  templateUrl: './person-form-2.component.html',
})
export class PersonForm2Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);
}
