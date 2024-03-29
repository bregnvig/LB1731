import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Person } from '../person';
import { NgFor } from '@angular/common';

export type TypedForm<T> = { [P in keyof T]?: AbstractControl<T[P] | null> };

@Component({
    selector: 'app-typed-form',
    templateUrl: './typed-form.component.html',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgFor,
    ],
})
export class TypedFormComponent {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  fg: FormGroup<TypedForm<Person>> = this.fb.group<TypedForm<Person>>({
    firstName: this.fb.control(this.model.firstName, [Validators.required]),
    lastName: this.fb.control(this.model.firstName, [Validators.required]),
    favoriteColor: this.fb.control(this.model.favoriteColor),
    height: this.fb.control(this.model.height, [Validators.min(100), Validators.max(200)])
  });

  constructor(private fb: FormBuilder) { }

  onSubmit() {
    this.fg.value;
    console.log('Value', { ...this.model, ...this.fg.value });
  }
}
