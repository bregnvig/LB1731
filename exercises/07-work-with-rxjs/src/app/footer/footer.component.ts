import { Component, Input } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-footer',
  template: `
  <footer *ngIf="playground">
    <h3>{{playground.name}}</h3>
    <p>{{playground.description}}</p>
    <p>{{playground.addressDescription}}</p>
  </footer>
  `
})
export class FooterComponent {

  @Input() playground?: Playground;
}
