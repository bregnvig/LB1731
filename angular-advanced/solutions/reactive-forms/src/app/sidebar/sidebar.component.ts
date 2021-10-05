import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {

  @Input() items: any[] | null = [];
  @Input() itemTemplate: TemplateRef<any> | undefined;
  @Output() selected = new EventEmitter<any>();
  @Output() filterChanged = new EventEmitter<string>();

  filterControl = new FormControl('');
  selectedItem: any | undefined;

  constructor() { }

  ngOnInit() {
    this.filterControl.valueChanges.subscribe(term => this.filterChanged.emit(term));
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.selected.emit(item);
  }

}
