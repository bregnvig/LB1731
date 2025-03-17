import { Component, input } from '@angular/core';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from '../pipe';

@Component({
  selector: 'loop-sidebar-list-item',
  imports: [
    DistancePipe,
    HumanizeDistancePipe,
    DefaultDescriptionPipe,
  ],
  template: `
    <li class="flex-item list-group-item d-flex list-group-item-action justify-content-between" [class.active]="selected()">
      <div class="d-flex flex-column justify-content-between">
        <h6 class="mb-1">{{playground().name}}
          <span class="badge bg-primary badge-pill">{{playground().position | distance: location() | humanizeDistance}}</span>
        </h6>
        <small>{{playground().description | defaultDescription}}</small>
      </div>
      <div>
        <ng-content/>
      </div>
    </li>
  `,
})
export class SidebarListItemComponent {
  playground = input.required<Playground>();
  selected = input.required<boolean>();
  location = input.required<Coordinate | null>();
}
