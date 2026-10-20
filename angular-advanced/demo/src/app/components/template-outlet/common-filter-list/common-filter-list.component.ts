import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'loop-common-filter-list',
  templateUrl: './common-filter-list.component.html',
  styleUrls: ['./common-filter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, NgTemplateOutlet]
})
export class CommonFilterListComponent {

  items = input<any[] | null>(null);
  property = input<string>();
  itemTemplateRef = input<TemplateRef<any>>();
  filter = output<string>();

  filterControl = new FormControl<string>('', { nonNullable: true });

  constructor() {
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      takeUntilDestroyed(),
    ).subscribe(term => this.filter.emit(term));
  }

}
