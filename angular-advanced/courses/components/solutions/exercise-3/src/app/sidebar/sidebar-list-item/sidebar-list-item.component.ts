import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Coordinate, Playground } from 'src/app/model';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from 'src/app/pipe';

@Component({
  selector: 'loop-sidebar-list-item',
  templateUrl: './sidebar-list-item.component.html',
  imports: [DistancePipe, HumanizeDistancePipe, DefaultDescriptionPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarListItemComponent {

  playground = input.required<Playground>();
  selected = input<boolean>();
  location = input<Coordinate | null>();
}
