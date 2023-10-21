import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { interval, switchMap } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-signals-with-rxjs',
  standalone: true,
  imports: [NgFor],
  template: `
    <ul class="list-group">
      <li *ngFor="let playground of playgrounds" class="list-group-item">  
        {{playground.name}}
      </li>
    </ul>
  `,
  styles: [
  ]
})
export class SignalsWithRxjsComponent {

  playgrounds: Playground[] = [];

  constructor(service: PlaygroundService) {
    interval(1000).pipe(
      switchMap(() => service.playgrounds$)
    ).subscribe(playgrounds => this.playgrounds = playgrounds);
  }
}
