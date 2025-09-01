import { Person } from './../person';
import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-person-form-3',
    templateUrl: './person-form-3.component.html',
    imports: [
    FormsModule,
    JsonPipe
]
})
export class PersonForm3Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  get diagnostic() {
    return JSON.stringify(this.model);
  }

}
