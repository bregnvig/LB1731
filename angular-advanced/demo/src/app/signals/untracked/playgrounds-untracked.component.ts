import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal, untracked } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { randFullName, randLatitude, randLongitude, randSequence } from '@ngneat/falso';
import { PlaygroundsUntrackedUserComponent } from './playgrounds-untracked-user.component';

const http = { post: console.log };

@Component({
  selector: 'loop-playgrounds-untracked',
  imports: [JsonPipe, NgbAlert, PlaygroundsUntrackedUserComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container">
      <div class="demo-surface signals">
        <div class="signal-tile">
          <h6><code>location()</code> <span>tracked</span></h6>
          <ngb-alert type="info" [dismissible]="false">
            {{location() | json}}
          </ngb-alert>
          <button type="button" class="btn btn-light" (click)="updateLocation()">updateLocation</button>
        </div>
        <div class="signal-tile">
          <h6><code>user()</code> <span>untracked</span></h6>
          <loop-playgrounds-untracked-user [user]="user()"/>
          <button type="button" class="btn btn-light" (click)="updateUser()">updateUser</button>
        </div>
      </div>
      <h6 class="mt-4">Posts</h6>
      <ul class="list-group log">
        @for (post of posts(); track post) {
          <li class="list-group-item">{{post}}</li>
        }
      </ul>
    </div>
  `,
  styleUrl: './playgrounds-untracked.component.scss',
})
export class PlaygroundsUntrackedComponent {
  user = signal({ id: randSequence(), name: randFullName() });
  location = signal({ lat: randLatitude(), lng: randLongitude(), });

  posts = signal<string[]>([]);

  constructor() {
    effect(() => {
      const user = untracked(() => this.user()); // Here we use untracked to avoid tracking the user signal

      http.post(`api/location/${user.id}`, this.location());
      this.posts.update(posts => [...posts, `api/location/${user.id}, ${JSON.stringify(this.location())}`]);
    });
  }

  updateUser(): void {
    this.user.update((user) => ({ ...user, id: randSequence() }));
  }

  updateLocation(): void {
    this.location.update((location) => ({ ...location, lat: randLatitude() }));
  }

}
