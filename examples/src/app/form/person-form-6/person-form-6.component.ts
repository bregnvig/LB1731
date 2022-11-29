import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Person } from './../person';

@Component({
  selector: 'app-person-form-6',
  templateUrl: './person-form-6.component.html',
})
export class PersonForm6Component implements OnInit {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  fg!: UntypedFormGroup;

  ngOnInit() {
    const mustBeFlemming = (control: AbstractControl): ValidationErrors | null => control.value === 'Flemming' ? null : { mustBeFlemming: true };
    this.fg = new UntypedFormGroup(
      {
        name: new UntypedFormGroup({
          firstName: new UntypedFormControl(this.model.firstName, [Validators.required, mustBeFlemming]),
          lastName: new UntypedFormControl(this.model.lastName, Validators.required)
        }),
        favoriteColor: new UntypedFormControl(this.model.favoriteColor),
        height: new UntypedFormControl(this.model.height, [Validators.min(100), Validators.max(220)])
      }
    );
  }

  onSubmit() {
    console.log(this.fg.valid);

    console.log('Value', this.fg.value);

  }

}
