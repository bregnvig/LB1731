import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NonProvidedService } from '../non-provided.service';

@Component({
  selector: 'app-non-provided',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: 'Will never work',
})
export class NonProvidedComponent {

  #service = inject(NonProvidedService);

  constructor() {

  }
}
