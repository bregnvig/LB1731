
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Person } from '../person';

@Component({
  selector: 'app-typed-form',
  templateUrl: './typed-form.component.html',
  imports: [
    ReactiveFormsModule
  ]
})
export class TypedFormComponent {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  fg = this.fb.group({
    firstName: this.fb.control<string>(this.model.firstName, [Validators.required]),
    lastName: this.fb.control(this.model.lastName, [Validators.required]),
    favoriteColor: this.fb.control(this.model.favoriteColor),
    height: this.fb.control(this.model.height, [Validators.min(100), Validators.max(200)])
  });

  constructor(private fb: FormBuilder) { }

  onSubmit() {
    this.fg.value;
    console.log('Value', { ...this.model, ...this.fg.value });
  }
}
