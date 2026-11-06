import { Component, input } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-footer',
  template: `
    @if(playground(); as playground) {
      <footer>
        <h3>{{playground.name}}</h3>
        <p>{{playground.description}}</p>
        <p>{{playground.addressDescription}}</p>
      </footer>
  }
  `,
})
export class FooterComponent {

  playground = input.required<Playground>();
}
