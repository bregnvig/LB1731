import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable } from 'rxjs';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  @Input() items: any[] | null = [];
  @Input() itemTemplate?: TemplateRef<any>;
  @Output() selected = new EventEmitter<any>();
  @Output() filterChanged = new EventEmitter<string>();

  selectedItem?: any;
  filterControl = new FormControl<string>('');
  location$: Observable<Coordinate> = this.locationService.location$;

  constructor(private locationService: LocationService) {
    this.filterControl.valueChanges.pipe(
      debounceTime(0)
    ).subscribe(value => this.filterChanged.emit(value ?? ''));
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.selected.emit(item);
  }

}
