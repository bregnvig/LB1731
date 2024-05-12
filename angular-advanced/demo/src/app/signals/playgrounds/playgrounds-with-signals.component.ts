
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription, interval, switchMap } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-playgrounds-with-signals',
  standalone: true,
  imports: [],
  template: `
    <ul class="list-group">
      @for (playground of playgrounds(); track playground) {
        <li class="list-group-item">
          {{playground.name}}
        </li>
      }
    </ul>`,
  styles: [
  ]
})
export class PlaygroundsWithSignalsComponent {

  playgrounds: Signal<Playground[]>;

  constructor(service: PlaygroundService) {
    this.playgrounds = toSignal(interval(1000).pipe(
      switchMap(() => service.playgrounds$)
    ), { initialValue: [] });
  }
}
