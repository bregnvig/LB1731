import { JsonPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'loop-reactive-form-state',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="playground">
      <section>
        <h2>Reactive Form State</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <div class="field">
            <div class="input-group">
              <span class="input-group-text">Name</span>
              <input formControlName="name" type="text" class="form-control" placeholder="Name" aria-label="Name">
            </div>
            @let nameControl = form.controls.name;
            <div class="flags">
              <span class="flag good" [class.on]="nameControl.valid">valid: {{ nameControl.valid }}</span>
              <span class="flag bad" [class.on]="nameControl.invalid">invalid: {{ nameControl.invalid }}</span>
              <span class="flag" [class.on]="nameControl.dirty">dirty: {{ nameControl.dirty }}</span>
              <span class="flag" [class.on]="nameControl.touched">touched: {{ nameControl.touched }}</span>
            </div>
          </div>
          <div class="field">
            <div class="input-group">
              <span class="input-group-text">Email</span>
              <input formControlName="email" type="text" class="form-control" placeholder="Email" aria-label="Email">
            </div>
            @let emailControl = form.controls.email;
            <div class="flags">
              <span class="flag good" [class.on]="emailControl.valid">valid: {{ emailControl.valid }}</span>
              <span class="flag bad" [class.on]="emailControl.invalid">invalid: {{ emailControl.invalid }}</span>
              <span class="flag" [class.on]="emailControl.dirty">dirty: {{ emailControl.dirty }}</span>
              <span class="flag" [class.on]="emailControl.touched">touched: {{ emailControl.touched }}</span>
            </div>
          </div>
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Submit</button>
        </form>

        <h2 class="mt-5">Filter working with URL</h2>
        <div class="input-group filter">
          <span class="input-group-text">Filter</span>
          <input [formControl]="filter" type="text" class="form-control" placeholder="filter" aria-label="filter">
        </div>
      </section>

      <aside class="inspector">
        <h2>Form State</h2>
        <p><strong>Value:</strong></p>
        <pre>{{ form.value | json }}</pre>

        <dl class="readout">
          <dt>Valid</dt><dd><span class="flag good" [class.on]="form.valid">{{ form.valid }}</span></dd>
          <dt>Invalid</dt><dd><span class="flag bad" [class.on]="form.invalid">{{ form.invalid }}</span></dd>
          <dt>Dirty</dt><dd><span class="flag" [class.on]="form.dirty">{{ form.dirty }}</span></dd>
          <dt>Touched</dt><dd><span class="flag" [class.on]="form.touched">{{ form.touched }}</span></dd>
        </dl>
      </aside>
    </div>
  `,
  styleUrl: './form-state.component.scss',
})
export class FormStateComponent {
  #activeRoute = inject(ActivatedRoute);
  #router = inject(Router);

  filter = new FormControl(this.#activeRoute.snapshot.params['filter']);

  constructor() {
    this.filter.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.#router.navigate([{ filter: value }], { queryParamsHandling: 'merge', relativeTo: this.#activeRoute });
    });
    //TODO: listen to route changes and filter playgrounds below
  }

  form = inject(FormBuilder).group({
    name: [this.#activeRoute.snapshot.params['name'], [Validators.required]],
    email: [this.#activeRoute.snapshot.params['email'], [Validators.required, Validators.email]]
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
