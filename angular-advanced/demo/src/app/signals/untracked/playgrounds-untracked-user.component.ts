import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'loop-playgrounds-untracked-user',
  imports: [JsonPipe, NgbAlert],
  template: `
    <ngb-alert type="info" class="mt-3" [dismissible]="false">
      {{user() | json}}
    </ngb-alert>
  `
})
export class PlaygroundsUntrackedUserComponent {
  user = input<{ id: string, name: string }>();
}
