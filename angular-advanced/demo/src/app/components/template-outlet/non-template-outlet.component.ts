import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-non-template-outlet',
  templateUrl: './non-template-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, ReactiveFormsModule]
})
export class NonTemplateOutletComponent {

  playgrounds: Signal<Playground[]>;
  filterControl = new FormControl<string>('', { nonNullable: true });
  constructor() {
    const service = inject(PlaygroundService);
    this.playgrounds = toSignal(combineLatest([
      service.playgrounds$,
      this.filterControl.valueChanges.pipe(
        debounceTime(300),
        startWith(''),
        map((term: string) => term.toLocaleLowerCase())
      )
    ]).pipe(
      map(([playgrounds, term]) => playgrounds.filter(p => p.name.toLocaleLowerCase().includes(term)))
    ), { initialValue: [] });
  }
}
