import { Person } from './../person';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-person-form-6',
  templateUrl: './person-form-6.component.html',
  styleUrls: ['./person-form-6.component.css']
})
export class PersonForm6Component implements OnInit {

   colors = ["Red", "Green", "Blue"];
   model = new Person('Flemming', 'Bregnvig', "Blue", 182);

   myForm: FormGroup;

  ngOnInit() {
    this.myForm = new FormGroup(
      {
        name: new FormGroup({
          firstName: new FormControl(this.model.firstName, Validators.required),
          lastName: new FormControl(this.model.lastName, Validators.required)
        }),
        favoriteColor: new FormControl(),
        height: new FormControl()
      }
    );
  }

   onSubmit() {
    console.log('Value', this.myForm.value);
    
  }

}
