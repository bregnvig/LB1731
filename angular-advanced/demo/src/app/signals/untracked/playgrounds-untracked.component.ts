import { JsonPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal, untracked } from '@angular/core';

@Component({
  selector: 'loop-playgrounds-untracked',
  standalone: true,
  imports: [NgFor, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <button type="button" class="btn btn-primary" (click)="updateLocation()">setInitialPlaygrounds</button>
      <span>
        location: {{location() | json}}
      </span>
    </div>
    
    <div class="mt-4">
      <button type="button" class="btn btn-primary" (click)="updateUser()">setInitialPlaygrounds</button>
      <span>
        user: {{user() | json}}
      </span>
    </div>
  `,
})
export class PlaygroundsUntrackedComponent {
  user = signal({ id: '1', name: 'John Doe' });
  location = signal({ lat: 52.520008, lng: 13.404954, });

  constructor() {
    effect(() => {
      const user = untracked(() => this.user());
      const http = { post: console.log };
      http.post(`api/location/${user.id}`, this.location());
    });
  }

  updateUser(): void {
    this.user.update((user) => ({ ...user, id: `${+user.id + 1}` }));
  }

  updateLocation(): void {
    this.location.update((location) => ({ ...location, lat: location.lat + 1 }));
  }

}
