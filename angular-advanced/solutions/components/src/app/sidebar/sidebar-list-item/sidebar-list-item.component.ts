import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from 'src/app/model';

@Component({
  selector: 'loop-sidebar-list-item',
  template: `
    <a
      class="flex-item list-group-item d-flex list-group-item-action justify-content-between"
      [class.active]="selected">
      <div class="flex-item d-flex flex-column justify-content-between">
        <h6 class="mb-1">
          {{playground.name}}
          <span class="badge bg-primary">{{playground.position | distance: (location$ | async) | humanizeDistance}}</span>
        </h6>
        <small>{{playground.description | defaultDescription}}</small>
      </div>
      <div>
        <ng-content select="button"></ng-content>
      </div>
    </a>  
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarListItemComponent {

  @Input() playground!: Playground;
  @Input() selected = false;
  @Input() location$!: Observable<Coordinate>;

}
