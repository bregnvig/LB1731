import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { getRandomPlayground, Playground } from 'src/app/shared';

@Component({
  selector: 'loop-infinite-loop',
  standalone: true,
  imports: [JsonPipe, NgbAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container mt-5">
      <button class="btn btn-primary mb-3" (click)="addRandomPlayground()">Add Random Playground</button>
      <ul class="list-group">
        @for (playground of playgrounds(); track playground.id) {
          <li class="list-group-item">
            <strong>{{ playground.name }}</strong> - {{ playground.addressDescription || 'No address available' }}
            <br>
            <small>Coordinates: {{ playground.position.lat }}, {{ playground.position.lng }}</small><br>
            <em>{{ playground.description || 'No description available' }}</em>
          </li>
        }
      </ul>
    </div>
  `,
})
export class InfiniteLoopComponent {
  playgrounds = signal<Playground[]>([getRandomPlayground(), getRandomPlayground()]);
  newPlayground = signal<Playground | null>(null, { equal: (a, b) => false });

  infiniteLoopEffect = effect(() => {
    const currentPlaygrounds = this.playgrounds();
    const newPlaygroundValue = this.newPlayground();

    if(currentPlaygrounds.length > 100) {
      console.log('Reached 100 playgrounds. Stopped before crashing the browser.');
      return;
    }
    if (newPlaygroundValue) {
      console.log('Adding new playground:', newPlaygroundValue);
      const updatedPlaygrounds = [...currentPlaygrounds, newPlaygroundValue];
      this.playgrounds.set(updatedPlaygrounds);
    }

  },
    { allowSignalWrites: true }
  );

  addRandomPlayground(): void {
    this.newPlayground.set(getRandomPlayground());
  }

}
