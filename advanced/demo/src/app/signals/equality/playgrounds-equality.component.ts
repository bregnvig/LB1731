
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, timer } from 'rxjs';
import { PlaygroundService } from 'src/app/shared';
import { SharedPlaygroundUlComponent } from "../../shared/component/shared-playground-ul.component";

@Component({
  selector: 'loop-playgrounds-equality',
  imports: [SharedPlaygroundUlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <section class="feed">
        <header>
          <h5>Playgrounds</h5>
          <code>toSignal(timer(0, 1000).pipe(switchMap(...)))</code>
          <span class="live">Refetched every second</span>
        </header>
        <div class="body">
          <loop-shared-playground-ul [playgrounds]="playgrounds()"/>
        </div>
      </section>
    </div>
  `,
  styles: `
    @import "src/scss/variables";
    @import "../feed";
  `
})
export class PlaygroundsEqualityComponent {

  #service = inject(PlaygroundService);

  playgrounds = toSignal(
    timer(0, 1000).pipe(switchMap(() => this.#service.playgrounds$)),
    {
      initialValue: [],
      // equal: (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2), // Uncomment this line to fix the issue
    }
  );

}
