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
        <p>{{ playground.description }} <a class="link-light" [routerLink]="['/legeplads', playground.id]">Detaljer</a></p>
      }
      <p><small>Opdateret for {{ seconds }} sekunder siden</small></p>
    </footer>
  `,
  imports: [RouterLink],
})
export class FooterComponent {

  @Input() playground?: Playground;
  @Input({ required: true }) loadedAt = 0;
  seconds = 0;

  constructor() {
    setInterval(() => this.seconds = Math.round((Date.now() - this.loadedAt) / 1000), 1000);
  }
}
