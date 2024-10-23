
import { Component } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-playgrounds-with-rxjs',
  standalone: true,
  imports: [],
  template: `
    <button type="button" class="btn btn-primary" (click)="subscription.unsubscribe()">Unsubscribe</button>
    <ul class="mt-3 list-group">
      @for (playground of playgrounds; track playground.id) {
        <li class="list-group-item">
          {{playground.name}}
        </li>
      }
    </ul>
    `,
  styles: [
  ]
})
export class PlaygroundsWithRxjsComponent {

  playgrounds: Playground[] = [];
  subscription: Subscription;

  constructor(service: PlaygroundService) {
    this.subscription = timer(0, 1000).pipe(
      switchMap(() => service.playgrounds$)
    ).subscribe(playgrounds => this.playgrounds = playgrounds);
  }
}
