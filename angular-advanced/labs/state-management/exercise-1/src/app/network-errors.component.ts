import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

interface NetworkErrorsState {
  read: boolean;
  update: boolean;
  delete: boolean;
}

export const getNetworkErrorsState = () => {
  return JSON.parse(sessionStorage.getItem('network-errors') ??  '{ "read": false, "update": false, "delete": false }') as NetworkErrorsState;
}

@Component({
  selector: 'loop-network-errors',
  template: `
    <div class="position-fixed bottom-0 start-0 p-3 d-flex flex-column">
      <h6>Simulate Network Errors</h6>
      <form [formGroup]="form" class="btn-group" role="group">
        <input formControlName="read" type="checkbox" class="btn-check" id="readCheck" autocomplete="off">
        <label class="btn btn-primary" for="readCheck">Read</label>

        <input formControlName="update" type="checkbox" class="btn-check" id="updateCheck" autocomplete="off">
        <label class="btn btn-primary" for="updateCheck">Update</label>

        <input formControlName="delete" type="checkbox" class="btn-check" id="deleteCheck" autocomplete="off">
        <label class="btn btn-primary" for="deleteCheck">Delete</label>
      </form>
    </div>`,
  imports: [
    ReactiveFormsModule,
  ],
  styles: `
    .position-fixed {
      z-index: 2000;
    }
  `
})

export class NetworkErrorsComponent {
  #fb = inject(FormBuilder);
  state = getNetworkErrorsState();
  form = this.#fb.group({
    read: this.#fb.nonNullable.control(this.state.read),
    update: this.#fb.nonNullable.control(this.state.update),
    delete: this.#fb.nonNullable.control(this.state.delete),
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      sessionStorage.setItem('network-errors', JSON.stringify(value));
      this.state = value as NetworkErrorsState;
    });
  }
}