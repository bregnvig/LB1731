import { Component, Input } from '@angular/core';
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

  @Input({ required: true }) playground?: Playground;
  @Input() selected = false;
  @Input() location?: Coordinate | null;
}
