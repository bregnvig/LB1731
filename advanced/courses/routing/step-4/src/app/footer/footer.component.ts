import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Playground } from '../model';



@Component({
    selector: 'loop-footer',
    template: `
    <footer>
      <h3>{{playground!.name}}</h3>
      <p>{{playground!.addressDescription}}</p>
      <p>{{playground!.description}}</p>
    </footer>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class FooterComponent {

  @Input() playground: Playground | undefined;
}
