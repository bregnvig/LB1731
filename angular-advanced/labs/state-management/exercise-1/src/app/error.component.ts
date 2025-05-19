import { Component, effect, input, signal } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error',
  template: `
  @if(show()) {
    <div class="position-fixed top-0 start-0 vh-100 vw-100 d-flex flex-column justify-content-center align-items-center">
      <ngb-alert type="danger" (closed)="show.set(false)">
      <h1>Oh dear 🫨</h1>
        @let _error = error();
      <p>{{_error?.message ?? _error ?? 'Something went wrong. Please try again later.'}}</p>
      </ngb-alert>
    </div>
  }
  `,
  styles: `
    .position-fixed {
      background-color: rgba(0,0,0,0.5);
      z-index: 1000;
    }
  `,
  imports: [NgbAlert]
})
export class ErrorComponent {
  error = input<any>();
  show = signal(false);

  constructor() {
    effect(() => this.error() && this.show.set(true));
  }
}