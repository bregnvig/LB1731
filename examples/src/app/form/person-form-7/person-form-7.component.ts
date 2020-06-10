import { Person } from './../person';
import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-person-form-7',
  templateUrl: './person-form-7.component.html',
  styleUrls: ['./person-form-7.component.css']
})
export class PersonForm7Component implements OnInit {

   colors = ["Red", "Green", "Blue"];
   model = new Person('Flemming', 'Bregnvig', "Blue", 182);

   myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: this.formBuilder.group({
        firstName: [this.model.firstName, Validators.required],
        lastName: [this.model.lastName, Validators.required]
      }),
      favoriteColor: [],
      height: []
    })
    
  }

   onSubmit() {
    console.log('Value', this.myForm.value);

  }


}
