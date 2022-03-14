import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'loop-common-list-filter-filter-fn',
  templateUrl: './common-list-filter-filter-fn.component.html',
  styleUrls: ['./common-list-filter-filter-fn.component.scss']
})
export class CommonListFilterFilterFnComponent implements OnInit {

  @Input() items!: any[] | null;
  @Input() itemTemplateRef: TemplateRef<any> | undefined;
  @Input() filterFn!: (term: string, items: any[]) => any[];

  filtered$!: Observable<any[]>;
  filterControl = new FormControl();

  constructor() { }

  ngOnInit(): void {
    this.filtered$ = this.filterControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(term => this.filterFn(term, this.items || []))
    );
  }

}
