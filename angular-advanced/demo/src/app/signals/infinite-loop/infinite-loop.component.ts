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

    if (this.playgrounds().length > 50000) {
      console.log('Reached 50000 playgrounds. Stopped before crashing the browser.');
      return;
    }
    if (newPlaygroundValue) {
      console.log('Adding new playground:', newPlaygroundValue);
      const updatedPlaygrounds = [...this.playgrounds(), newPlaygroundValue];
      this.playgrounds.set(updatedPlaygrounds);
      // this.newPlayground.set(null); // Uncomment this line to stop the infinite loop
    }

  });

  addRandomPlayground(): void {
    this.newPlayground.set(getRandomPlayground());
  }

}
