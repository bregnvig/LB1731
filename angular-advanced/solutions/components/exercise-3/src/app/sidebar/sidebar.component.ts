import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, map } from 'rxjs';
import { Coordinate } from '../model';
import { LocationService } from '../service';
import { NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'loop-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgFor,
        NgTemplateOutlet,
    ],
})
export class SidebarComponent {

  @Input({ required: true }) items: any[] | null = [];
  @Input() itemTemplate?: TemplateRef<any>;
  @Output() selected = new EventEmitter<any>();
  @Input({ required: true }) filterFn?: (term: string, item: any) => boolean;

  selectedItem?: any;
  filterControl = new FormControl<string>('');
  location$: Observable<Coordinate> = this.locationService.location$;
  filtered$: Observable<any[]>;

  constructor(private locationService: LocationService) {
    this.filtered$ = this.filterControl.valueChanges.pipe(
      debounceTime(0),
      map(term => (this.items ?? []).filter(item => this.filterFn?.(term ?? '', item)))
    );
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.selected.emit(item);
  }

}
