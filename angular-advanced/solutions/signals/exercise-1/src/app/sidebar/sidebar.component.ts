import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe, DistancePipe } from "../pipe";
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  imports: [NgFor, NgIf, AsyncPipe, FontAwesomeModule, DefaultDescriptionPipe, DistancePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  @Input() playgrounds: Playground[] | null = [];
  @Output() selected = new EventEmitter<Playground>();

  selectedPlayground: Playground | undefined;
  location = inject(LocationService).location;

  selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }

}
