import { Component, Input } from '@angular/core';
import { Playground } from '../model';

@Component({
  selector: 'loop-footer',
  standalone: true,
  template: `
    <footer>
      <h3>{{ playground!.name }}</h3>
      <p>{{ playground!.addressDescription }}</p>
      <p>{{ playground!.description }}</p>
    </footer>
  `,
})
export class FooterComponent {

  @Input({ required: true }) playground?: Playground;
}
