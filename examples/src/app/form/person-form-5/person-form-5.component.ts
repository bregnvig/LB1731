import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-form-5',
  templateUrl: './person-form-5.component.html',
})
export class PersonForm5Component {

  colors = ["Red", "Green", "Blue"];

  logValues(values: any) {
    console.log('Values', values);
  }

}
