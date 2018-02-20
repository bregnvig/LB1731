import { Component, OnInit } from '@angular/core';
import { RandomService } from 'app/services/random.service';

@Component({
  selector: 'app-provided',
  template: '{{service.random}}'
})
export class ProvidedComponent {

  constructor(public service: RandomService) { }
}
