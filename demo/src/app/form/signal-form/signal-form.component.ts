import { Component, signal } from '@angular/core';
import { FormField, FormRoot, form, max, min, required, submit } from '@angular/forms/signals';

/**
 * Signal forms derive the field tree from the shape of the model, so every
 * field must be present on the type. The shared `Person` class has an optional
 * `height`, which cannot be bound directly - hence this local model type.
 */
interface PersonModel {
  firstName: string;
  lastName: string;
  favoriteColor: string;
  height: number;
}

@Component({
  selector: 'app-signal-form',
  templateUrl: './signal-form.component.html',
  imports: [FormField, FormRoot]
})
export class SignalFormComponent {

  protected colors = ["Red", "Green", "Blue"];

  // The model is a plain writable signal - no FormGroup, no FormBuilder.
  #model = signal<PersonModel>({
    firstName: 'Flemming',
    lastName: 'Bregnvig',
    favoriteColor: 'Blue',
    height: 182,
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
