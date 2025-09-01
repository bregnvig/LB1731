
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Person } from './../person';
@Component({
  selector: 'app-oneway',
  templateUrl: './oneway.component.html',
  imports: [FormsModule]
})
export class OnewayComponent {
  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  logValue(value: any) {
    console.log('NgForm Value', { ...value });
    console.log('Value', { ...this.model, ...value });
    // console.log('Value', Object.assign(this.model, value));
  }
}
