import { Component, Input } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-footer',
  template: `
    @if(playground) {
      <footer>
        <h3>{{playground.name}}</h3>
        <p>{{playground.description}}</p>
        <p>{{playground.addressDescription}}</p>
      </footer>
  }
  `,
  standalone: true,
})
export class FooterComponent {

  @Input() playground?: Playground;
}
