import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-person-form-5',
  templateUrl: 'person-form-5.component.html',
  styleUrls: ['person-form-5.component.css']
})
export class PersonForm5Component implements OnInit {

  public colors = ["Red", "Green", "Blue"];

  constructor() { }

  ngOnInit() {
  }

  public logValues(values: any) {
    console.log('Values', values);
  }

}
