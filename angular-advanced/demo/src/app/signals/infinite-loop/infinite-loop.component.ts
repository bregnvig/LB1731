import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { getRandomPlayground, Playground } from 'src/app/shared';
import { SharedPlaygroundUlComponent } from "../../shared/component/shared-playground-ul.component";

@Component({
  selector: 'loop-infinite-loop',
  imports: [SharedPlaygroundUlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <button class="btn btn-primary mb-3" (click)="addRandomPlayground()">Add Random Playground</button>
      <loop-shared-playground-ul [playgrounds]="playgrounds()"/>
    </div>
  `,
  styles: `
    @import "src/scss/variables";

    // Number every row, so a runaway effect shows up as a climbing count
    loop-shared-playground-ul {
      position: static; // not the list-group-item default, so the total below anchors to .container
      display: block;
      max-height: 36rem;
      overflow-y: auto;
      padding: 0;
      border-radius: $border-radius-lg;
      counter-reset: row;
    }

    :host ::ng-deep loop-shared-playground-li {
      position: relative;
      padding-left: 4.5rem;
      counter-increment: row;
      animation: row-in .3s ease-out;

      &::before {
        content: counter(row);
        position: absolute;
        top: .75rem;
        left: 1rem;
        width: 2.5rem;
        padding: .125rem 0;
        border-radius: 999px;
        background: $canvas-deep;
        color: $cobalt;
        font-family: $font-family-monospace;
        font-size: .8125rem;
        font-weight: 600;
        text-align: center;
      }
    }

    // The running total, read from the same counter after the last row.
    // Positioned against .container, so it stays put while the list scrolls.
    .container {
      position: relative;
    }

    :host ::ng-deep loop-shared-playground-ul > ul::after {
      content: counter(row) " playgrounds";
      position: absolute;
      top: -.25rem;
      right: .75rem;
      color: $azure;
      font-size: 2.5rem;
      font-weight: 700;
      font-stretch: 75%;
      line-height: 1;
    }

    // Phones: room above the button for the total
    @media (max-width: 575.98px) {
      .container { padding-top: 3rem; }
    }

    @keyframes row-in {
      from { background: rgba($azure, .12); }
    }
  `
})
export class InfiniteLoopComponent {
  playgrounds = signal<Playground[]>([getRandomPlayground(), getRandomPlayground()]);
  newPlayground = signal<Playground | null>(null);

  infiniteLoopEffect = effect(() => {
    const newPlaygroundValue = this.newPlayground();

    if (this.playgrounds().length > 200) {
      console.log('Reached 200 playgrounds. Stopped before the tab freezes.');
      return;
    }
    if (newPlaygroundValue) {
      console.log('Adding new playground:', newPlaygroundValue);
      const updatedPlaygrounds = [...this.playgrounds(), newPlaygroundValue];
      this.playgrounds.set(updatedPlaygrounds);
      // this.newPlayground.set(null); // Uncomment this line to stop the infinite loop
    }
    // Fix 1: read playgrounds with untracked(() => this.playgrounds()), so writing it doesn't rerun the effect.
    // The real fix: no effect. addRandomPlayground() does this.playgrounds.update(p => [...p, getRandomPlayground()]).

  });

  addRandomPlayground(): void {
    this.newPlayground.set(getRandomPlayground());
  }

}
