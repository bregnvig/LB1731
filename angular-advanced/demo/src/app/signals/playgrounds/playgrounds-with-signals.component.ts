
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, timer } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';
import { SharedPlaygroundUlComponent } from "../../shared/component/shared-playground-ul.component";

@Component({
  selector: 'loop-playgrounds-with-signals',
  standalone: true,
  imports: [SharedPlaygroundUlComponent],
  template: `<loop-shared-playground-ul [playgrounds]="playgrounds()"/>`,
})
export class PlaygroundsWithSignalsComponent {

  playgrounds: Signal<Playground[]>;

  constructor(service: PlaygroundService) {
    this.playgrounds = toSignal(timer(0, 1000).pipe(
      switchMap(() => service.playgrounds$)
    ), { initialValue: [] });
  }
}
