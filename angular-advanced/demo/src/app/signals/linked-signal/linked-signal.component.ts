import { ChangeDetectionStrategy, Component, computed, effect, linkedSignal, signal } from '@angular/core';
import { getRandomPlayground, Playground } from 'src/app/shared';
import { SharedPlaygroundUlComponent } from "../../shared/component/shared-playground-ul.component";
import { SharedPlaygroundLiComponent } from 'src/app/shared/component/shared-playground-li.component';

@Component({
  selector: 'loop-linked-signal',
  imports: [SharedPlaygroundUlComponent, SharedPlaygroundLiComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <button class="btn btn-primary mb-3" (click)="selectPlayground()">Add Random Playground</button>
      <div>
        <h6>Selected Playground</h6>
        <loop-shared-playground-li [playground]="selectedPlayground()"/>
      </div>
      <!-- <div>
        <h6>Old way Selected Playground</h6>
        <loop-shared-playground-li [playground]="state().selectedPlayground()"/>
      </div> -->

      <loop-shared-playground-ul class="mt-3" [playgrounds]="playgrounds()"/>
    </div>
  `
})
export class LinkedSignalComponent {
  playgrounds = signal<Playground[]>(Array.from({ length: 100 }, () => getRandomPlayground()));

  selectedPlayground = linkedSignal(() => this.playgrounds()[0]);

  selectPlayground() {
    this.selectedPlayground.set(this.playgrounds()[Math.floor(Math.random() * this.playgrounds().length)]);
  }

  // // Old way of doing it
  // state = computed(() => {
  //   return {
  //     playgrounds: this.playgrounds(),
  //     selectedPlayground: signal(this.playgrounds()[0]),
  //   };
  // })

  // selectPlayground() {
  //   this.state().selectedPlayground.set(this.playgrounds()[Math.floor(Math.random() * this.playgrounds().length)]);
  // }

}
