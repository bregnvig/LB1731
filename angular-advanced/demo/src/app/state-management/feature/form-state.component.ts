import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'loop-reactive-form-state',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <div>
      <h1>Reactive Form State Example</h1>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="d-flex align-items-baseline">
          <div class="input-group mb-3 w-25">
            <span class="input-group-text">Name</span>
            <input formControlName="name" type="text" class="form-control" placeholder="Name" aria-label="Name">
          </div>
          @let nameControl = form.controls.name;
          <span class="ms-3">valid: {{ nameControl.valid }}, invalid: {{ nameControl.invalid }}, dirty: {{ nameControl.dirty }}, touched: {{ nameControl.touched }}</span>
        </div>
        <div class="d-flex align-items-baseline">
          <div class="input-group mb-3 w-25">
            <span class="input-group-text">Email</span>
            <input formControlName="email" type="text" class="form-control" placeholder="Email" aria-label="Email">
          </div>
          @let emailControl = form.controls.email;
          <span class="ms-3">valid: {{ emailControl.valid }}, invalid: {{ emailControl.invalid }}, dirty: {{ emailControl.dirty }}, touched: {{ emailControl.touched }}</span>
        </div>
        <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Submit</button>
      </form>

      <hr />

      <h2>Form State</h2>
      <p><strong>Value:</strong></p>
      <pre>{{ form.value | json }}</pre>

      <p><strong>Valid:</strong> {{ form.valid }}</p>
      <p><strong>Invalid:</strong> {{ form.invalid }}</p>
      <p><strong>Dirty:</strong> {{ form.dirty }}</p>
      <p><strong>Touched:</strong> {{ form.touched }}</p>

    </div>
  `,
})
export class FormStateComponent {
  form = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  })

  submit() {
    console.log('Form submitted!', this.form.value);
  }

  getControlStates() {
    return Object.keys(this.form.controls).reduce((acc, key) => {
      const ctrl = this.form.get(key);
      acc[key] = {
        value: ctrl?.value,
        valid: ctrl?.valid,
        invalid: ctrl?.invalid,
        touched: ctrl?.touched,
        dirty: ctrl?.dirty,
      };
      return acc;
    }, {} as Record<string, any>);
  }
}
