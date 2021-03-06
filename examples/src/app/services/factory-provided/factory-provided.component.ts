import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { RandomService, RANDOM_FACTORY } from '../random.service';

@Component({
  selector: 'app-factory-provided',
  template: '{{service.random}}',
  styleUrls: ['./factory-provided.component.css']
})
export class FactoryProvidedComponent {

   service: RandomService;

  constructor( @Inject(RANDOM_FACTORY) service: () => RandomService) {
    this.service = service();
  }


}
