import { Component, inject } from '@angular/core';
import { NonProvidedService } from '../non-provided.service';

@Component({
  selector: 'app-non-provided',
  template: 'Will never work',
})
export class NonProvidedComponent {

  #service = inject(NonProvidedService);

  constructor() {

  }
}
