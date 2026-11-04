import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Playground } from '../model';

@Component({
  selector: 'loop-footer',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <footer>
      @if (playground) {
        <h3>{{ playground.name }}</h3>
        <p>{{ playground.addressDescription }}</p>
        <p>{{ playground.description }} <a class="link-light" [routerLink]="['/legeplads', playground.id]">Details</a></p>
      }
      <p><small>Updated {{ seconds }} seconds ago</small></p>
    </footer>
  `,
  imports: [RouterLink],
})
export class FooterComponent {

  @Input() playground?: Playground;
  seconds = 0;

  constructor() {
    setInterval(() => this.seconds++, 1000);
  }
}
