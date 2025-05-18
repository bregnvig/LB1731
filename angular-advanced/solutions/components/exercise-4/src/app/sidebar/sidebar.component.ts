import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgTemplateOutlet, AsyncPipe]
})
export class SidebarComponent {

  @Input() itemTemplate?: TemplateRef<any>;
  @Output() selected = new EventEmitter<any>();
  @Input({ required: true }) filterFn?: ((term: string) => any[]) | null;

  selectedItem?: any;
  filterControl = new FormControl<string>('');
  location$: Observable<Coordinate> = this.locationService.location$;
  filtered$?: Observable<any[]>;

  constructor(private locationService: LocationService) {
  }

  ngOnChanges(): void {
    const filterFn = this.filterFn;

    filterFn && (this.filtered$ = this.filterControl.valueChanges.pipe(
      startWith(this.filterControl.value),
      debounceTime(300),
      map(term => filterFn(term ?? ''))
    ));
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.selected.emit(item);
  }

}
