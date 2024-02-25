import { Component } from '@angular/core';
import { Person } from './../person';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-person-form-4',
    templateUrl: './person-form-4.component.html',
    standalone: true,
    imports: [FormsModule, NgFor],
})
export class PersonForm4Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('', '', '');

  get diagnostic() {
    return JSON.stringify(this.model);
  }


}
