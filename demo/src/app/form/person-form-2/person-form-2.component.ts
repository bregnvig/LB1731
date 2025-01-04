import { Component } from '@angular/core';
import { Person } from './../person';
import { NgFor, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-person-form-2',
    templateUrl: './person-form-2.component.html',
    standalone: true,
    imports: [
        FormsModule,
        NgFor,
        JsonPipe,
    ],
})
export class PersonForm2Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);
}
