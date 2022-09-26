import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from '../person';

type PersonForm = {
  [K in keyof Person]?: AbstractControl<Person[K]>
};

@Component({
  selector: 'app-typed-form',
  templateUrl: './typed-form.component.html',
  styleUrls: ['./typed-form.component.scss']
})
export class TypedFormComponent implements OnInit {

  colors = ["Red", "Green", "Blue"];
  model = new Person('Flemming', 'Bregnvig', "Blue", 182);

  fg: FormGroup<PersonForm>;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.fg = this.fb.group<PersonForm>({
      firstName: this.fb.control(this.model.firstName, [Validators.required]),
      lastName: this.fb.control(this.model.firstName, [Validators.required]),
      favoriteColor: this.fb.control(this.model.favoriteColor),
      height: this.fb.control(this.model.height, [Validators.min(100), Validators.max(200)])
    });

  }

  onSubmit() {
    console.log('Value', { ...this.model, ...this.fg.value });
  }
}
