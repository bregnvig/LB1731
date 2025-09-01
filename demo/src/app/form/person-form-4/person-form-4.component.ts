import { Component } from '@angular/core';
import { Person } from './../person';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-person-form-4',
    templateUrl: './person-form-4.component.html',
    imports: [FormsModule]
})
export class PersonForm4Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('', '', '');

  get diagnostic() {
    return JSON.stringify(this.model);
  }


}
