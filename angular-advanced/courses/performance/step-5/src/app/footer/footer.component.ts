import { NgComponentOutlet } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal, Type } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Playground } from '../model';

@Component({
  selector: 'loop-footer',
  template: `
    <footer>
      @if (playground) {
        <h3>{{ playground.name }}</h3>
        <p>{{ playground.addressDescription }}</p>
        <p>{{ playground.description }} <a class="link-light" [routerLink]="['/legeplads', playground.id]">Detaljer</a></p>
      }
      <p>
        <small>Opdateret for {{ seconds() }} sekunder siden</small>
        <button class="btn btn-sm btn-outline-light ms-2" (click)="toggleAbout()">Om appen</button>
      </p>
      <ng-container *ngComponentOutlet="about()"/>
    </footer>
  `,
  imports: [RouterLink, NgComponentOutlet],
})
export class FooterComponent {

  @Input() playground?: Playground;
  @Input({ required: true }) loadedAt = 0;
  seconds = signal(0);
  about = signal<Type<unknown> | null>(null);

  constructor() {
    const id = setInterval(() => this.seconds.set(Math.round((Date.now() - this.loadedAt) / 1000)), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  async toggleAbout() {
    if (this.about()) {
      this.about.set(null);
    } else {
      const { AboutComponent } = await import('../about/about.component');
      this.about.set(AboutComponent);
    }
  }
}
