import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Playground } from '../model';

@Component({
  selector: 'loop-footer',
  standalone: true,
  template: `
    <footer>
      <h3>{{playground!.name}}</h3>
      <p>{{playground!.addressDescription}}</p>
      <p>{{playground!.description}}</p>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  @Input() playground?: Playground;
}
