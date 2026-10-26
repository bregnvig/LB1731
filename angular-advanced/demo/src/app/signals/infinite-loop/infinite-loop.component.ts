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
