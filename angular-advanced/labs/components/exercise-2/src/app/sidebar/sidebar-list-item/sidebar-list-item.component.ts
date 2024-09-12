import { Component, Input } from '@angular/core';
import { Coordinate, Playground } from 'src/app/model';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from 'src/app/pipe';

@Component({
  selector: 'loop-sidebar-list-item',
  templateUrl: './sidebar-list-item.component.html',
  styleUrls: ['./sidebar-list-item.component.scss'],
  standalone: true,
  imports: [DistancePipe, HumanizeDistancePipe, DefaultDescriptionPipe]
})
export class SidebarListItemComponent {

  @Input() playground!: Playground;
  @Input() selected = false;
  @Input() location?: Coordinate | null;
}
