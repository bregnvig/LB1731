import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'loop-common-filter-list',
  templateUrl: './common-filter-list.component.html',
  styleUrls: ['./common-filter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonFilterListComponent implements OnInit {

  @Input() items: any;
  @Input() itemTemplateRef: TemplateRef<any> | undefined;
  @Output() filter = new EventEmitter<string>();

  filterControl = new FormControl();

  constructor() { }

  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(term => this.filter.next(term));
  }

}
