import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Playground } from '../model';

@Component({
  selector: 'loop-footer',
  template: `
    <footer>
      @if (playground(); as playground) {
        <h3>{{ playground.name }}</h3>
        <p>{{ playground.addressDescription }}</p>
        <p>{{ playground.description }} <a class="link-light" [routerLink]="['/legeplads', playground.id]">Details</a></p>
      }
      <p><small>Updated {{ seconds() }} seconds ago</small></p>
    </footer>
  `,
  imports: [RouterLink],
})
export class FooterComponent {

  playground = input<Playground>();
  seconds = signal(0);

  constructor() {
    const id = setInterval(() => this.seconds.update(s => s + 1), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
