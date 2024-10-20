import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe, DistancePipe } from '../pipe';

@Component({
  selector: 'loop-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [FaIconComponent, DefaultDescriptionPipe, DistancePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

  playgrounds = input.required<Playground[] | undefined>();
  selectedPlayground = input<Playground | undefined>();
  location = input<Coordinate | undefined>(undefined);

  selected = output<Playground>();

}
