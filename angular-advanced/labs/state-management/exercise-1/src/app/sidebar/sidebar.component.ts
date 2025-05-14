import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Playground } from '../model';
import { DefaultDescriptionPipe, DistancePipe } from "../pipe";
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [FaIconComponent, DefaultDescriptionPipe, DistancePipe, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  playgrounds = input<Playground[] | null>([]);
  loading = input<boolean>(false);
  edit = output<Playground>();

  selected = model<Playground | undefined>();
  location = toSignal(inject(LocationService).location$);

  filterControl = new FormControl<string>('');
  filteredPlaygrounds: Signal<Playground[] | undefined>;

  constructor() {
    const filter = toSignal(this.filterControl.valueChanges);
    this.filteredPlaygrounds = computed(() => {
      return this.playgrounds()?.filter(p => p.name.toLocaleLowerCase().includes(filter()?.toLocaleLowerCase() ?? ''));
    });
  }

  selectPlayground(playground: Playground): void {
    this.selected.set(playground);
  }

}
