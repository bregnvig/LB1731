import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { Playground } from '../model';

@Component({
  selector: 'loop-footer',
  standalone: true,
  template: `
    @if(playground(); as playground) {
      <footer>
        <h3>{{playground.name}}</h3>
        <p>{{playground?.addressDescription ?? 'No address description'}}</p>
        <p>{{playground?.description ?? 'No description'}}</p>
      </footer>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  playground = input.required<Playground>();
}
