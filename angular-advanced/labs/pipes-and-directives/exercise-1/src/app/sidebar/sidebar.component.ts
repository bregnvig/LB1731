import { AsyncPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe } from '../pipe/default-description.pipe';
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    FaIconComponent,
    AsyncPipe,
    DefaultDescriptionPipe,
  ]
})
export class SidebarComponent {

  #locationService = inject(LocationService);

  playgrounds = input<Playground[] | null>([]);
  selected = output<Playground>();
  edit = output<Playground>();

  selectedPlayground: Playground | undefined;
  location$: Observable<Coordinate> = this.#locationService.location$;

  selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }

}
