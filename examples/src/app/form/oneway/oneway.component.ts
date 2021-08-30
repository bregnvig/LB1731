import { Component } from '@angular/core';
import { Person } from './../person';
@Component({
  selector: 'app-oneway',
  templateUrl: './oneway.component.html',
  styleUrls: ['./oneway.component.css']
})
export class OnewayComponent {
  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  constructor() { }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  logValue(value: any) {
    console.log('Value', { ...this.model, ...value });
    // console.log('Value', Object.assign(this.model, value));
  }
}
