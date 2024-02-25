import { Component, Input } from '@angular/core';
import { Playground } from '../shared';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-footer',
    template: `
  <footer *ngIf="playground">
    <h3>{{playground.name}}</h3>
    <p>{{playground.description}}</p>
    <p>{{playground.addressDescription}}</p>
  </footer>
  `,
    standalone: true,
    imports: [NgIf]
})
export class FooterComponent {

  @Input() playground?: Playground;
}
