import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-person-form-5',
    templateUrl: './person-form-5.component.html',
    standalone: true,
    imports: [FormsModule, NgFor],
})
export class PersonForm5Component {

  colors = ["Red", "Green", "Blue"];

  logValues(values: any) {
    console.log('Values', values);
  }

}
