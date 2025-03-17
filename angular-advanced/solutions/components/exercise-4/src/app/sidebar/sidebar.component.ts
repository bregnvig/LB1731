import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, output, TemplateRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DynamicIoModule } from 'ng-dynamic-component';
import { combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  template: `
    <ng-template #defaultTemplate let-item>
      <li class="list-group-item">{{item}}</li>
    </ng-template>
    <aside tabindex="1">
      <nav>
        <div class="container my-3">
          <div class="row">
            <div class="col">
              <input id="filter" [formControl]="filterControl" autofocus type="text" class="form-control form-control-lg">
            </div>
          </div>
          <div class="list-group">
            @for (item of filtered$ | async; track item) {
              <ng-container [ngTemplateOutlet]="itemTemplate() ?? defaultTemplate" [ngTemplateOutletContext]="{$implicit: item}"/>
            }
          </div>
        </div>
      </nav>
    </aside>
  `,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgTemplateOutlet,
    DynamicIoModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

  itemTemplate = input<TemplateRef<any>>();
  filterFn = input.required<((term: string) => any[]) | null>();
  selected = output<any>();

  selectedItem?: any;
  filterControl = new FormControl<string>('');
  location$: Observable<Coordinate> = this.locationService.location$;
  filtered$?: Observable<any[]> = combineLatest([
    toObservable(this.filterFn),
    this.filterControl.valueChanges.pipe(startWith(this.filterControl.value), debounceTime(300))
  ]).pipe(
    map(([filterFn, term]) => filterFn && filterFn(term ?? '') || [])
  );

  constructor(private locationService: LocationService) { }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.selected.emit(item);
  }

}
