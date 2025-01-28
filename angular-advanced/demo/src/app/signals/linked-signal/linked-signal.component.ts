import { ChangeDetectionStrategy, Component, effect, linkedSignal, signal } from '@angular/core';
import { getRandomPlayground, Playground } from 'src/app/shared';
import { SharedPlaygroundUlComponent } from "../../shared/component/shared-playground-ul.component";
import { SharedPlaygroundLiComponent } from 'src/app/shared/component/shared-playground-li.component';

@Component({
  selector: 'loop-infinite-loop',
  imports: [SharedPlaygroundUlComponent, SharedPlaygroundLiComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <button class="btn btn-primary mb-3" (click)="selectPlayground()">Add Random Playground</button>
      <div>
        <h6>Selected Playground</h6>
        <loop-shared-playground-li [playground]="selectedPlayground()"/>

      <loop-shared-playground-ul [playgrounds]="playgrounds()"/>
    </div>
  `
})
export class LinkedSignalComponent {
  playgrounds = signal<Playground[]>([getRandomPlayground(), getRandomPlayground(), getRandomPlayground(), getRandomPlayground(), getRandomPlayground(), getRandomPlayground()]);

  selectedPlayground = linkedSignal(() => this.playgrounds()[0]);

  selectPlayground() {
    this.selectedPlayground.set(this.playgrounds()[Math.floor(Math.random() * this.playgrounds().length)]);
  }

}
