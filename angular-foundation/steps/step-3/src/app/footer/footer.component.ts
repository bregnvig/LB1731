import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if(playground(); as p) {
      <footer>
        <h3>{{p.name}}</h3>
        <p>{{p.description}}</p>
        <p>{{p.addressDescription}}</p>
      </footer>
  }
  `,
})
export class FooterComponent {

  playground = input.required<Playground | undefined>();
}
