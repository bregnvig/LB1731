import { Component, input } from "@angular/core";
import { Coordinate, Playground } from "../model";
import { DefaultDescriptionPipe } from "../pipe/default-description.pipe";
import { DistancePipe } from "../pipe/distance.pipe";
import { HumanizeDistancePipe } from "../pipe/humanize-distance.pipe";

@Component({
  selector: "loop-sidebar-list-item",
  template: `
  @if(playground(); as p) {
    <li
      class="flex-item list-group-item d-flex list-group-item-action justify-content-between"
      [class.active]="selected()">
      <div class="d-flex flex-column justify-content-between">
        <h6 class="mb-1">{{p.name}}
          <span class="badge bg-primary badge-pill">{{p.position | distance: location() | humanizeDistance}}</span>
        </h6>
        <small>{{p.description | defaultDescription}}</small>
      </div>
      <div>
        <ng-content select="button"/>
      </div>
    </li>
  }
  `,
  imports: [DefaultDescriptionPipe, HumanizeDistancePipe, DistancePipe]
})
export class SidebarListItemComponent {
  playground = input.required<Playground>();
  selected = input<boolean>(false);
  location = input<Coordinate | null>(null);
}