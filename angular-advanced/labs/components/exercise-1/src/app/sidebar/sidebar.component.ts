import { Component, input, output, signal } from '@angular/core';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe } from "../pipe/default-description.pipe";
import { DistancePipe } from "../pipe/distance.pipe";
import { HumanizeDistancePipe } from "../pipe/humanize-distance.pipe";

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    DistancePipe,
    HumanizeDistancePipe,
    DefaultDescriptionPipe
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
