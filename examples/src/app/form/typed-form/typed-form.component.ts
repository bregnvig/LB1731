import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from '../person';

export type TypedForm<T> = { [P in keyof T]?: AbstractControl<T[P]> };

@Component({
  selector: 'app-typed-form',
  templateUrl: './typed-form.component.html',
  styleUrls: ['./typed-form.component.scss']
})
export class TypedFormComponent implements OnInit {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  fg: FormGroup<TypedForm<Person>>;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.fg = this.fb.group<TypedForm<Person>>({
      firstName: this.fb.control(this.model.firstName, [Validators.required]),
      lastName: this.fb.control(this.model.firstName, [Validators.required]),
      favoriteColor: this.fb.control(this.model.favoriteColor),
      height: this.fb.control(this.model.height, [Validators.min(100), Validators.max(200)])
    });

  }

  onSubmit() {
    this.fg.value;
    console.log('Value', { ...this.model, ...this.fg.value });
  }
}
