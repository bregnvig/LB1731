import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Playground } from 'src/app/shared';

@Component({
  selector: 'loop-signals-with-signals',
  standalone: true,
  imports: [NgFor],
  template: `
    <ul class="list-group">
      <li *ngFor="let playground of playgrounds()" class="list-group-item">  
        {{playground.name}}
      </li>
    </ul>  `,
  styles: [
  ]
})
export class SignalsWithSignalsComponent {

  playgrounds: Signal<Playground[]>;

}
