import { Component, input, output } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';
import { DefaultDescriptionPipe } from '../pipe/default-description.pipe';
import { HumanizeDistancePipe } from '../pipe/humanize-distance.pipe';
import { DistancePipe } from '../pipe/distance.pipe';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'loop-sidebar',
    templateUrl: './sidebar.component.html',
    imports: [
        AsyncPipe,
        DistancePipe,
        HumanizeDistancePipe,
        DefaultDescriptionPipe,
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
