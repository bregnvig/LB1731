import { Component, Input, OnChanges, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';

@Component({
    selector: 'loop-common-list-filter-filter-fn',
    templateUrl: './common-list-filter-filter-fn.component.html',
    styleUrls: ['./common-list-filter-filter-fn.component.scss'],
    standalone: false
})
export class CommonListFilterFilterFnComponent implements OnChanges {

  @Input() itemTemplateRef: TemplateRef<any> | undefined;
  @Input() filterFn?: (term: string) => Observable<any[]>;

  filtered$?: Observable<any[]>;
  filterControl = new FormControl<string>('', { nonNullable: true });

  ngOnChanges(): void {
    const filterFn = this.filterFn;

    if (filterFn) {
      this.filtered$ = this.filterControl.valueChanges.pipe(
        startWith(this.filterControl.value),
        debounceTime(300),
        switchMap(term => filterFn(term))
      );
    }
  }

}
