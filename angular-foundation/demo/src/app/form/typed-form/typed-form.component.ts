
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Person } from '../person';

@Component({
  selector: 'app-typed-form',
  template: `
    <h2>Person typed form</h2>
    <div class="container">
      <form [formGroup]="fg" (ngSubmit)="onSubmit()">
        <fieldset>
          <div class="form-group">
            <label for="firstName">First name</label>
            <input type="text" class="form-control" formControlName="firstName">
          </div>
          <div class="form-group">
            <label for="lastName">Last name</label>
            <input type="text" class="form-control" formControlName="lastName">
          </div>
        </fieldset>
        <div class="form-group">
          <label for="favoriteColor">Favorite color</label>
          <select class="form-control" formControlName="favoriteColor">
            @for (color of colors; track color) {
              <option [value]="color">{{color}}</option>
            }
          </select>
        </div>
        <div class="form-group mb-3">
          <label for="height">Height</label>
          <input type="number" class="form-control" id="height" formControlName="height">
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="fg.invalid">Submit</button>
      </form>
    </div>
  `,
  imports: [
    ReactiveFormsModule
  ]
})
export class TypedFormComponent {

  protected colors = ["Red", "Green", "Blue"];
  #model: Person = { firstName: 'Flemming', lastName: 'Bregnvig', favoriteColor: 'Blue', height: 182, shoeSize: 43 };

  #fb = inject(FormBuilder);

  protected fg = this.#fb.group({
    firstName: this.#fb.control<string>(this.#model.firstName, [Validators.required]),
    lastName: this.#fb.control(this.#model.lastName, [Validators.required]),
    favoriteColor: this.#fb.control(this.#model.favoriteColor),
    height: this.#fb.control(this.#model.height, [Validators.min(100), Validators.max(220)])
  });

  protected onSubmit() {
    this.fg.value;
    console.log('Value', { ...this.#model, ...this.fg.value });
  }
}
