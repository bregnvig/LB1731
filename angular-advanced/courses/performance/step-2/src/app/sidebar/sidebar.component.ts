import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Coordinate, Playground } from '../model';
import { SidebarListItemComponent } from './sidebar-list-item/sidebar-list-item.component';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FaIconComponent, SidebarListItemComponent],
})
export class SidebarComponent {

  playgrounds = input.required<Playground[] | undefined>();
  selectedPlayground = model<Playground | undefined>();
  location = input<Coordinate | undefined>(undefined);

}
