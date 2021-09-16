import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Person } from './../person';

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
    const mustBeFlemming = (control: AbstractControl): ValidationErrors | null => control.value === 'Flemming' ? null : { mustBeFlemming: true };
    this.myForm = new FormGroup(
      {
        name: new FormGroup({
          firstName: new FormControl(this.model.firstName, [Validators.required, mustBeFlemming]),
          lastName: new FormControl(this.model.lastName, Validators.required)
        }),
        favoriteColor: new FormControl(),
        height: new FormControl(null, [Validators.min(100), Validators.max(220)])
      }
    );
  }

  onSubmit() {
    console.log('Value', this.myForm.value);

  }

}
