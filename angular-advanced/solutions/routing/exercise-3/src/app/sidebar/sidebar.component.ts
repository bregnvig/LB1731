import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {

  @Input() playgrounds: Playground[] | null | undefined = [];
  @Input() selectedPlayground: Playground | null | undefined = null;
  @Output() edit = new EventEmitter<Playground>();
  @Output() filter = new EventEmitter<string>();

  filterControl = new FormControl();

  location$: Observable<Coordinate> = this.locationService.location$;

  constructor(private locationService: LocationService) { }

  @Input() set term(value: string | null) {
    this.filterControl.reset(value);
  };

  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(term => this.filter.emit(term));

  }

}
