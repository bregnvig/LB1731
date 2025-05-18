import { Component, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Playground } from './model';

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
    <div class="position-fixed p-3 d-flex flex-column rounded" [class.with-playground]="playground()">
      <h6 class="text-white">Simulate Network Errors</h6>
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
      background-color: rgba(0,0,0,0.5);
      z-index: 2000;
      left: 4px;
      bottom: 4px;
      transition: transform 0.5s ease-in-out;
      &.with-playground {
        transform: translateY(-122px);
      }
    }
  `
})

export class NetworkErrorsComponent {

  playground = input<Playground>();

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