import { Component } from '@angular/core';
import { NonProvidedService } from '../non-provided.service';

@Component({
    selector: 'app-non-provided',
    template: 'Will never work',
    standalone: true
})
export class NonProvidedComponent {

   constructor(private service: NonProvidedService) {

  }
}
