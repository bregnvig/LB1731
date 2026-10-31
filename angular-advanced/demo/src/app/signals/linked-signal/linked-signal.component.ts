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
      <div class="demo-surface picks">
        <div class="pick">
          <h6>Short form: resets to the first</h6>
          <loop-shared-playground-li [playground]="selected()"/>
        </div>
        <div class="pick">
          <h6>Long form: keeps the selection if it's still there</h6>
          <loop-shared-playground-li [playground]="kept()"/>
        </div>
      </div>
      <loop-shared-playground-ul class="mt-3 p-0 border-0" [playgrounds]="playgrounds()"/>
    </div>
  `,
  styles: `
    @import "src/scss/variables";

    .picks {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
      gap: 1.5rem;
    }

    // The two linked signals' current values, as selected cards on the stage
    .pick {
      h6 {
        color: $white;
      }

      loop-shared-playground-li {
        display: block;
        min-height: 7.5rem;
        padding: 1rem 1.25rem;
        border: 0;
        background: $white;
        color: $ink;
        border-radius: $border-radius-lg;
        box-shadow: $lift-shadow;
      }
    }
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
