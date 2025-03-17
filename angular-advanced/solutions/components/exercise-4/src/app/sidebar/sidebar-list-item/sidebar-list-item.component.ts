import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Coordinate, Playground } from 'src/app/model';
import { DefaultDescriptionPipe } from '../../pipe/default-description.pipe';
import { HumanizeDistancePipe } from '../../pipe/humanize-distance.pipe';
import { DistancePipe } from '../../pipe/distance.pipe';

@Component({
    selector: 'loop-sidebar-list-item',
    templateUrl: './sidebar-list-item.component.html',
    styleUrls: ['./sidebar-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DistancePipe, HumanizeDistancePipe, DefaultDescriptionPipe]
})
export class SidebarListItemComponent {

  @Input() playground!: Playground;
  @Input() selected = false;
  @Input() location?: Coordinate | null;
}
