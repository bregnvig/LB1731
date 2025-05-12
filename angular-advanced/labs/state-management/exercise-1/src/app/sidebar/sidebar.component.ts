import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Playground } from '../model';
import { DefaultDescriptionPipe, DistancePipe } from "../pipe";
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [FaIconComponent, DefaultDescriptionPipe, DistancePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  playgrounds = input<Playground[] | null>([]);
  selected = output<Playground>();
  edit = output<Playground>();

  selectedPlayground: Playground | undefined;
  location = toSignal(inject(LocationService).location$);

  loading = computed(() => !this.playgrounds()?.length || !this.location());

  selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }

}
