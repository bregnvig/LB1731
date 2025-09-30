import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Coordinate, Playground } from '../model';
import { SidebarListItemComponent } from './sidebar-list-item/sidebar-list-item.component';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    SidebarListItemComponent,
    FaIconComponent,
  ],
})
export class SidebarComponent {

  playgrounds = input<Playground[] | null>([]);
  selected = output<Playground>();
  location = input<Coordinate | null>();

  selectedPlayground = signal<Playground | undefined>(undefined);

  selectPlayground(playground: Playground): void {
    this.selectedPlayground.set(playground);
    this.selected.emit(playground);
  }

}
