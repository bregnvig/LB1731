import { Component, signal } from '@angular/core';
import { FormField, FormRoot, form, max, min, required, submit } from '@angular/forms/signals';
import { Person } from '../person';

@Component({
  selector: 'app-signal-form',
  templateUrl: './signal-form.component.html',
  imports: [FormField, FormRoot]
})
export class SignalFormComponent {

  protected colors = ["Red", "Green", "Blue"];

  // The model is a plain writable signal - no FormGroup, no FormBuilder.
  // Person can be bound directly: signal forms need every field to be present,
  // but they are happy with a nullable one, so `height: number | null` is fine.
  #model = signal<Person>(new Person('Flemming', 'Bregnvig', 'Blue', 182));

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
