import { ChangeDetectionStrategy, Component, input, OnInit, output, TemplateRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'loop-common-filter-list',
  templateUrl: './common-filter-list.component.html',
  styleUrls: ['./common-filter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, NgTemplateOutlet]
})
export class CommonFilterListComponent implements OnInit {

  items = input<any[] | null>(null);
  property = input<string>();
  itemTemplateRef = input<TemplateRef<any>>();
  filter = output<string>();

  filterControl = new FormControl<string>('', { nonNullable: true });

  constructor() { }

  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(term => this.filter.emit(term));
  }

}
