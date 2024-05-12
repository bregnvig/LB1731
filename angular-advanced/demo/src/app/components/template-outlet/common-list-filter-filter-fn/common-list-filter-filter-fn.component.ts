import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'loop-common-list-filter-filter-fn',
  templateUrl: './common-list-filter-filter-fn.component.html',
  styleUrls: ['./common-list-filter-filter-fn.component.scss']
})
export class CommonListFilterFilterFnComponent {

  @Input() items!: any[] | null;
  @Input() itemTemplateRef: TemplateRef<any> | undefined;
  @Input() filterFn!: (term: string, item: any) => boolean;

  filtered$: Observable<any[]>;
  filterControl = new FormControl<string>('');

  constructor() {
    this.filtered$ = this.filterControl.valueChanges.pipe(
      startWith(this.filterControl.value),
      debounceTime(300),
      map(term => (this.items ?? []).filter(item => this.filterFn(term ?? '', item)))
    );
  }

}
