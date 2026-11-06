import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Playground } from '../model';



@Component({
  selector: 'loop-footer',
  template: `
    @if(playground(); as p) {
    <footer>
      <h3>{{p.name}}</h3>
      <p>{{p.addressDescription}}</p>
      <p>{{p.description}}</p>
    </footer>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class FooterComponent {

  playground = input<Playground | undefined>();
}
