import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input({ required: true }) playgrounds: Playground[] | undefined;
  @Input() selectedPlayground: Playground | undefined;
  @Input() location: Coordinate | undefined;

  @Output() selected = new EventEmitter<Playground>();

}
