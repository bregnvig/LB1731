import { ChangeDetectionStrategy, Component, linkedSignal, signal } from '@angular/core';
import { getRandomPlayground, Playground } from 'src/app/shared';
import { SharedPlaygroundUlComponent } from "../../shared/component/shared-playground-ul.component";
import { SharedPlaygroundLiComponent } from 'src/app/shared/component/shared-playground-li.component';

const newPlaygrounds = () => Array.from({ length: 5 }, () => getRandomPlayground());

@Component({
  selector: 'loop-linked-signal',
  imports: [SharedPlaygroundUlComponent, SharedPlaygroundLiComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <div class="btn-group mb-3">
        <button class="btn btn-primary" (click)="selectRandom()">Select random</button>
        <button class="btn btn-outline-primary" (click)="shuffle()">Shuffle</button>
        <button class="btn btn-outline-primary" (click)="replace()">New playgrounds</button>
      </div>
      <div class="row">
        <div class="col">
          <h6>Short form: resets to the first</h6>
          <loop-shared-playground-li [playground]="selected()"/>
        </div>
        <div class="col">
          <h6>Long form: keeps the selection if it's still there</h6>
          <loop-shared-playground-li [playground]="kept()"/>
        </div>
      </div>
      <loop-shared-playground-ul class="mt-3" [playgrounds]="playgrounds()"/>
    </div>
  `
})
export class LinkedSignalComponent {
  playgrounds = signal<Playground[]>(newPlaygrounds());

  // Writable, and recomputed (back to the first) whenever playgrounds changes.
  selected = linkedSignal(() => this.playgrounds()[0]);

  // The long form gets the previous value, so it can keep it when it's still in the list.
  kept = linkedSignal<Playground[], Playground>({
    source: this.playgrounds,
    computation: (playgrounds, previous) => playgrounds.find(p => p.id === previous?.value.id) ?? playgrounds[0],
  });

  selectRandom() {
    const playgrounds = this.playgrounds();
    const playground = playgrounds[Math.floor(Math.random() * playgrounds.length)];
    this.selected.set(playground);
    this.kept.set(playground);
  }

  // Same playgrounds, new order: a new array, so both linked signals recompute.
  shuffle() {
    this.playgrounds.update(playgrounds => [...playgrounds].sort(() => Math.random() - 0.5));
  }

  replace() {
    this.playgrounds.set(newPlaygrounds());
  }
}
