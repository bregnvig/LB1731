import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-playgrounds-with-rxjs',
  standalone: true,
  imports: [NgFor],
  template: `
    <button type="button" class="btn btn-primary" (click)="subscription.unsubscribe()">Unsubscribe</button>
    <ul class="mt-3 list-group">
      <li *ngFor="let playground of playgrounds" class="list-group-item">  
        {{playground.name}}
      </li>
    </ul>
  `,
  styles: [
  ]
})
export class PlaygroundsWithRxjsComponent {

  playgrounds: Playground[] = [];
  subscription: Subscription;

  constructor(service: PlaygroundService) {
    this.subscription = interval(1000).pipe(
      switchMap(() => service.playgrounds$)
    ).subscribe(playgrounds => this.playgrounds = playgrounds);
  }
}
