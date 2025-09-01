import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Person } from './../person';



@Component({
    selector: 'app-person-form-1',
    templateUrl: './person-form-1.component.html',
    imports: [FormsModule, JsonPipe]
})
export class PersonForm1Component {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  logValue(value: any) {
    console.log('Value', value);
  }
}
