import { AsyncPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';
import { SidebarListItemComponent } from "./sidebar-list-item.component";

@Component({
  selector: 'loop-sidebar',
  template: `
    <aside tabindex="1">
      <nav>
        <div class="container my-3">
          <div class="list-group">
            @for (playground of playgrounds(); track playground.id) {
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

  playgrounds = input<Playground[] | null>([]);
  selected = output<Playground>();

  selectedPlayground?: Playground;
  location$: Observable<Coordinate> = this.locationService.location$;

  constructor(private locationService: LocationService) { }

  selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }

}
