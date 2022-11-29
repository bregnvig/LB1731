import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Person } from './../person';


@Component({
  selector: 'app-person-form-7',
  templateUrl: './person-form-7.component.html',
})
export class PersonForm7Component implements OnInit {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  fg!: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    const nameValidator = (control: AbstractControl) => control.value === 'Flemming' ? null : { nameIsWrong: true };
    this.fg = this.formBuilder.group({
      name: this.formBuilder.group({
        firstName: [this.model.firstName, [Validators.required, nameValidator]],
        lastName: [this.model.lastName, Validators.required]
      }),
      favoriteColor: [this.model.favoriteColor],
      height: [this.model.height, [Validators.min(100), Validators.max(200)]]
    });

  }

  onSubmit() {
    console.log('Value', { ...this.model, ...this.fg.value });

  }


}
