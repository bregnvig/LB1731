import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';
import { DefaultDescriptionPipe } from '../pipe/default-description.pipe';
import { HumanizeDistancePipe } from '../pipe/humanize-distance.pipe';
import { DistancePipe } from '../pipe/distance.pipe';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'loop-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [
        NgFor,
        AsyncPipe,
        DistancePipe,
        HumanizeDistancePipe,
        DefaultDescriptionPipe,
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
