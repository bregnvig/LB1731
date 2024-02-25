import { Component } from '@angular/core';
import { Person } from './../person';
import { NgFor, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
    selector: 'app-person-form-1',
    templateUrl: './person-form-1.component.html',
    standalone: true,
    imports: [FormsModule, NgFor, JsonPipe]
})
export class PersonForm1Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  logValue(value: any) {
    console.log('Value', value);
  }
}
