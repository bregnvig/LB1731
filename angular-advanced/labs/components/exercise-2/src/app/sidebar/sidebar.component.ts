import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe } from '../pipe/default-description.pipe';
import { DistancePipe } from '../pipe/distance.pipe';
import { HumanizeDistancePipe } from '../pipe/humanize-distance.pipe';
import { LocationService } from '../service';
import { SidebarListItemComponent } from "./sidebar-list-item.component";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'loop-sidebar',
  template: `
    <aside tabindex="1">
      <nav>
        <div class="container my-3">
          <div class="list-group">
            @for (playground of playgrounds; track playground.id) {
              <loop-sidebar-list-item [playground]="playground" [selected]="playground === selectedPlayground" [location]="location$ | async">
                <button class="btn btn-sm btn-secondary" (click)="selectPlayground(playground)">
                  <fa-icon [icon]="['fas', 'check']"></fa-icon> 
                </button> 
              </loop-sidebar-list-item>
            }
          </div>
        </div>
      </nav>
    </aside>
  `,
  imports: [
    AsyncPipe,
    FaIconComponent,
    SidebarListItemComponent
  ],
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
