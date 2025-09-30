import { Component, input } from '@angular/core';
import { Coordinate, Playground } from 'src/app/model';
import { DefaultDescriptionPipe } from '../../pipe/default-description.pipe';
import { DistancePipe } from '../../pipe/distance.pipe';
import { HumanizeDistancePipe } from '../../pipe/humanize-distance.pipe';

@Component({
  selector: 'loop-sidebar-list-item',
  templateUrl: './sidebar-list-item.component.html',
  styleUrls: ['./sidebar-list-item.component.scss'],
  imports: [DistancePipe, HumanizeDistancePipe, DefaultDescriptionPipe]
})
export class SidebarListItemComponent {

  playground = input.required<Playground>();
  selected = input(false);
  location = input<Coordinate | null>();
}
