import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar-list-item',
  template: `
    <button
      class="list-group-item d-flex list-group-item-action justify-content-between"
      [class.active]="active()">
      <div class="d-flex flex-column">
        <h6 class="mb-1">{{ playground().name }}</h6>
        <small>{{ description() }}</small>
      </div>
      <div>
        <span class="badge bg-primary badge-pill">{{ distance() }}</span>
      </div>
    </button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SidebarListItemComponent {

  active = input<boolean>(false);
  playground = input.required<Playground>();
  location = input<Coordinate | undefined>(undefined);
  distance: Signal<string>;
  description = computed(() => this.playground().description ?? 'No description');

  constructor({ getDistance }: LocationService) {
    this.distance = computed(() => {
      const location = this.location();
      const position = this.playground().position;
      return (location && position) ? `${getDistance(position, location)}m` : 'Unknown location';
    });
  }

}
