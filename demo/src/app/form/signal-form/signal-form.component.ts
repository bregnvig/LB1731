import { Component, signal } from '@angular/core';
import { FormField, FormRoot, form, max, min, required, submit } from '@angular/forms/signals';
import { Person } from '../person';

/**
 * Signal forms derive the field tree from the shape of the model, so every
 * field must be both present and non-nullable. `Person` declares
 * `height?: number | null`, which is neither, so we derive the model type
 * from it rather than writing the fields out a second time:
 *
 *   -?                 removes the `?`   (what Required<T> does)
 *   NonNullable<...>   removes the `| null`
 *
 * Deriving it this way means the form follows `Person` if `Person` changes.
 */
type PersonModel = { [K in keyof Person]-?: NonNullable<Person[K]> };

@Component({
  selector: 'app-signal-form',
  templateUrl: './signal-form.component.html',
  imports: [FormField, FormRoot]
})
export class SignalFormComponent {

  protected colors = ["Red", "Green", "Blue"];

  // The model is a plain writable signal - no FormGroup, no FormBuilder.
  // An object literal is checked against PersonModel without a cast.
  #model = signal<PersonModel>({
    firstName: 'Flemming',
    lastName: 'Bregnvig',
    favoriteColor: 'Blue',
    height: 182,
    shoeSize: 42,
  });

  // form() derives a field tree from the model. The rules below are declared
  // against paths into that tree, so they are checked against the model's
  // type: misspell a field and it will not compile.
  protected fg = form(this.#model, (person) => {
    required(person.firstName);
    required(person.lastName);
    min(person.height, 100);
    max(person.height, 220);
  });

  protected onSubmit() {
    submit(this.fg, async () => {
      console.log('Value', this.fg().value());
    });
  }
}
