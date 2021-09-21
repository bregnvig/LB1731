import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from 'src/app/model';

@Component({
  selector: 'loop-sidebar-list-item',
  template: `
    <a
      class="list-group-item d-flex list-group-item-action justify-content-between align-items-center"
      [class.active]="selected">
      <div class="d-flex flex-column justify-content-between">
        <h5 class="mb-1">{{playground.name}}</h5>
        <small>{{playground.description | defaultDescription}}</small>
      </div>
      <span class="badge bg-primary">{{playground.position | distance: (location$ | async) | humanizeDistance}}</span>
    </a>  
  `,
})
export class SidebarListItemComponent {

  @Input() playground!: Playground;
  @Input() selected = false;
  @Input() location$!: Observable<Coordinate>;

}
