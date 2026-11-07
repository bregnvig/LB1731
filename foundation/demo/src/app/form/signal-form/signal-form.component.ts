import { Component, signal } from '@angular/core';
import { FormField, FormRoot, form, max, min, required, submit } from '@angular/forms/signals';
import { Person } from '../person';

@Component({
  selector: 'app-signal-form',
  template: `
    <h2>Person signal form</h2>
    <div class="container">
      <form [formRoot]="form" (submit)="onSubmit()">
        <fieldset>
          <div class="form-group">
            <label for="firstName">First name</label>
            <input type="text" class="form-control" id="firstName" [formField]="form.firstName">
          </div>
          <div class="form-group">
            <label for="lastName">Last name</label>
            <input type="text" class="form-control" id="lastName" [formField]="form.lastName">
          </div>
        </fieldset>
        <div class="form-group">
          <label for="favoriteColor">Favorite color</label>
          <select class="form-control" id="favoriteColor" [formField]="form.favoriteColor">
            @for (color of colors; track color) {
              <option [value]="color">{{color}}</option>
            }
          </select>
        </div>
        <div class="form-group mb-3">
          <label for="height">Height</label>
          <input type="number" class="form-control" id="height" [formField]="form.height">
        </div>
        <button type="submit" class="btn btn-primary" [disabled]="form().invalid()">Submit</button>
      </form>
    </div>
  `,
  imports: [FormField, FormRoot]
})
export class SignalFormComponent {

  protected colors = ["Red", "Green", "Blue"];

  // The model is a plain writable signal - no FormGroup, no FormBuilder.
  // Person can be bound directly: signal forms need every field to be present,
  // but they are happy with a nullable one, so `height: number | null` is fine.
  #model = signal<Person>({ firstName: 'Flemming', lastName: 'Bregnvig', favoriteColor: 'Blue', height: 182, shoeSize: 43 });

  // form() derives a field tree from the model. The rules below are declared
  // against paths into that tree, so they are checked against the model's
  // type: misspell a field and it will not compile.
  protected form = form(this.#model, (person) => {
    required(person.firstName);
    required(person.lastName);
    min(person.height, 100);
    max(person.height, 220);
  });

  protected onSubmit() {
    submit(this.form, async () => {
      console.log('Value', this.form().value());
    });
  }
}
