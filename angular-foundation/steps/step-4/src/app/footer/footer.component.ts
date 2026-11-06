import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Playground } from '../shared';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if(playground(); as p) {
      <footer>
        <h3>{{p.name}}</h3>
        <p>{{p.addressDescription}}</p>
        <p>{{p.description}}</p>
      </footer>
    }
  `,
})
export class FooterComponent {

  playground = input.required<Playground | undefined>();
}
