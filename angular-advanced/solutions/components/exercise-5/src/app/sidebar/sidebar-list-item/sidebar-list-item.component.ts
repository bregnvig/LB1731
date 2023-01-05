import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from 'src/app/model';

@Component({
  selector: 'loop-sidebar-list-item',
  templateUrl: './sidebar-list-item.component.html',
  styleUrls: ['./sidebar-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarListItemComponent {

  @Input() playground!: Playground;
  @Input() selected?: Playground;
  @Input() location$?: Observable<Coordinate>;
}
