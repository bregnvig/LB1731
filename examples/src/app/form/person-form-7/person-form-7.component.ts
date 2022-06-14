import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from './../person';


@Component({
  selector: 'app-person-form-7',
  templateUrl: './person-form-7.component.html',
  styleUrls: ['./person-form-7.component.css']
})
export class PersonForm7Component implements OnInit {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  fg: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    const nameValidator = (control: AbstractControl) => control.value === 'Flemming' ? null : { nameIsWrong: true };
    this.fg = this.formBuilder.group({
      name: this.formBuilder.group({
        firstName: [this.model.firstName, [Validators.required, nameValidator]],
        lastName: [this.model.lastName, Validators.required]
      }),
      favoriteColor: [],
      height: [undefined, [Validators.min(100), Validators.max(200)]]
    });

  }

  onSubmit() {
    console.log('Value', { ...this.model, ...this.fg.value });

  }


}
