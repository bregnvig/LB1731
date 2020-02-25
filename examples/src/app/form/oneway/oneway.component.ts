import { Person } from './../person';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-oneway',
  templateUrl: './oneway.component.html',
  styleUrls: ['./oneway.component.css']
})
export class OnewayComponent implements OnInit {
  public colors = ["Red", "Green", "Blue"];
  public model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  constructor() { }

  ngOnInit() {
    this.model['blabla'] = 42;
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }

  logValue(value: any) {
    console.log('Value', {...this.model, ...value});
  }
}
