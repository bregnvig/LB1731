import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultDescriptionPipe } from "../pipe/default-description.pipe";
import { DistancePipe } from "../pipe/distance.pipe";
import { HumanizeDistancePipe } from "../pipe/humanize-distance.pipe";
import { LocationService } from '../service/location.service';
import { Coordinate } from '../model/coordinate';
import { Playground } from '../model/playground';

@Component({
    selector: 'loop-sidebar',
    template: `
    <aside tabindex="1">
      <nav>
        <div class="list-group">
          @for (playground of playgrounds; track playground.id) {
            <a 
              class="list-group-item d-flex list-group-item-action justify-content-between align-items-center"
              [class.active]="playground === selectedPlayground"
              (click)="selectPlayground(playground)">
              <div class="d-flex flex-column justify-content-between">
                <h5 class="mb-1">{{playground.name}}</h5>
                <small>{{playground.description | defaultDescription}}</small>
              </div>
              <span class="badge badge-primary badge-pill">{{playground.position | distance: (location$ | async) | humanizeDistance}}</span>
            </a>
          }
        </div>
      </nav>
    </aside>
  `,
    imports: [DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  @Input() playgrounds: Playground[] | null = [];
  @Output() selected = new EventEmitter<Playground>();

  selectedPlayground: Playground | undefined;
  location$: Observable<Coordinate> = inject(LocationService).location$;

  selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }

}
