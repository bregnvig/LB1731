import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from 'src/app/model';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from 'src/app/pipe';

@Component({
  selector: 'loop-sidebar-list-item',
  templateUrl: './sidebar-list-item.component.html',
  styleUrls: ['./sidebar-list-item.component.scss'],
  imports: [DistancePipe, HumanizeDistancePipe, DefaultDescriptionPipe, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarListItemComponent {

  playground = input.required<Playground>();
  selected = input<Playground>();
  location$ = input<Observable<Coordinate>>();
}
