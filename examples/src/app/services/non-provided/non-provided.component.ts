import { Component, OnInit } from '@angular/core';
import { NonProvidedService } from 'app/services/non-provided.service';

@Component({
  selector: 'app-non-provided',
  template: 'Will never work'
})
export class NonProvidedComponent {

  public constructor(private service: NonProvidedService) {

  }
}
