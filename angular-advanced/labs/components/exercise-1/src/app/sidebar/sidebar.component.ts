import { AsyncPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';
import { SidebarListItemComponent } from "./sidebar-list-item.component";

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    AsyncPipe,
    SidebarListItemComponent,
    FaIconComponent
  ]
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
