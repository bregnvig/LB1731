
import { Component } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';
import { SharedPlaygroundUlComponent } from 'src/app/shared/component/shared-playground-ul.component';

@Component({
  selector: 'loop-playgrounds-with-rxjs',
  standalone: true,
  imports: [SharedPlaygroundUlComponent],
  template: `
    <button type="button" class="btn btn-primary" (click)="subscription.unsubscribe()">Unsubscribe</button>
    <loop-shared-playground-ul class="mt-3" [playgrounds]="playgrounds"/>
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
