import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal, untracked } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-playgrounds-untracked',
  standalone: true,
  imports: [JsonPipe, NgbAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <button type="button" class="btn btn-primary" (click)="updateLocation()">updateLocation</button>
      <ngb-alert type="info" class="mt-3" [dismissible]="false">
        location: {{location() | json}}
      </ngb-alert>
    </div>
    
    <div class="mt-4">
      <button type="button" class="btn btn-primary" (click)="updateUser()">updateUser</button>
      <ngb-alert type="info" class="mt-3" [dismissible]="false">
        user: {{user() | json}}
      </ngb-alert>
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
