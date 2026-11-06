import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'loop-common-list-filter-filter-fn',
  templateUrl: './common-list-filter-filter-fn.component.html',
  styleUrls: ['./common-list-filter-filter-fn.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormsModule, ReactiveFormsModule, NgTemplateOutlet]
})
export class CommonListFilterFilterFnComponent {

  itemTemplateRef = input<TemplateRef<any>>();
  filterFn = input<(term: string) => any[]>();

  protected filterControl = new FormControl<string>('', { nonNullable: true });

  #term = toSignal(this.filterControl.valueChanges.pipe(
    debounceTime(300),
  ), { initialValue: this.filterControl.value });
  items = computed(() => {
    const fn = this.filterFn();
    const term = this.#term();
    return fn?.(term) ?? [];
  });

}
