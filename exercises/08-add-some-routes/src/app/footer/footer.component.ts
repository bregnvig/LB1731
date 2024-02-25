import { Component, Input } from '@angular/core';
import { Playground } from '../shared';

@Component({
    selector: 'app-footer',
    template: `
  <footer>
    <h3>{{playground.name}}</h3>
    <p>{{playground.description}}</p>
    <p>{{playground.addressDescription}}</p>
  </footer>
  `,
    styles: [],
    standalone: true
})
export class FooterComponent {

  @Input() playground!: Playground;
}
