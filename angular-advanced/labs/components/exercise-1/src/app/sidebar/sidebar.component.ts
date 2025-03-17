import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe } from '../pipe/default-description.pipe';
import { DistancePipe } from '../pipe/distance.pipe';
import { HumanizeDistancePipe } from '../pipe/humanize-distance.pipe';
import { LocationService } from '../service'; 

@Component({
    selector: 'loop-sidebar',
    template: `
      <aside tabindex="1">
        <nav>
          <div class="container my-3">
            <div class="list-group">
              @for (playground of playgrounds; track playground.id) {
                <li class="flex-item list-group-item d-flex list-group-item-action justify-content-between"
                    [class.active]="playground === selectedPlayground"
                    (click)="selectPlayground(playground)">
                  <div class="d-flex flex-column justify-content-between">
                    <h6 class="mb-1">{{playground.name}}
                      <span class="badge bg-primary badge-pill">{{playground.position | distance: (location$ | async) | humanizeDistance}}</span>
                    </h6>
                    <small>{{playground.description | defaultDescription}}</small>
                  </div>
                </li>
              }
            </div>
          </div>
        </nav>
      </aside>
    `,
    imports: [
        AsyncPipe,
        DistancePipe,
        HumanizeDistancePipe,
        DefaultDescriptionPipe,
    ]
})
export class SidebarComponent {

  @Input() playgrounds: Playground[] | null = [];
  @Output() selected = new EventEmitter<Playground>();

  selectedPlayground?: Playground;
  location$: Observable<Coordinate> = this.locationService.location$;

  constructor(private locationService: LocationService) { }

  selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }

}
