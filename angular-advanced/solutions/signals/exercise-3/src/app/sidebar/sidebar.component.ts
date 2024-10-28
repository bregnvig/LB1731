import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe, DistancePipe } from '../pipe';
import { SidebarListItemComponent } from './sidebar-list-item.component';

@Component({
  selector: 'loop-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [FaIconComponent, DefaultDescriptionPipe, DistancePipe, SidebarListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

  playgrounds = input.required<Playground[] | undefined>();
  selectedPlayground = model<Playground | undefined>();
  location = input<Coordinate | undefined>(undefined);

}
