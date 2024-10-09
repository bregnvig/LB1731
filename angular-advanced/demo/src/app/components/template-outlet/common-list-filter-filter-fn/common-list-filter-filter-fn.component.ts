import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'loop-common-list-filter-filter-fn',
  templateUrl: './common-list-filter-filter-fn.component.html',
  styleUrls: ['./common-list-filter-filter-fn.component.scss']
})
export class CommonListFilterFilterFnComponent implements OnChanges {

  @Input() itemTemplateRef: TemplateRef<any> | undefined;
  @Input() filterFn?: (term: string) => any[];

  filtered$?: Observable<any[]>;
  filterControl = new FormControl<string>('', { nonNullable: true });

  ngOnChanges(): void {
    const filterFn = this.filterFn;

    if (filterFn) {
      this.filtered$ = this.filterControl.valueChanges.pipe(
        startWith(this.filterControl.value),
        debounceTime(300),
        map(term => filterFn(term))
      );
    }
  }

}
