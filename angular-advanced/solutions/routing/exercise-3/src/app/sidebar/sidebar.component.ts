import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, debounceTime } from 'rxjs';
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

  location$: Observable<Coordinate> = this.locationService.location$;
  filterControl = new FormControl(this.route.snapshot.queryParams['filter'] ?? '', { nonNullable: true });

  constructor(private locationService: LocationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(filter => this.router.navigate([], {
      queryParams: { filter }
    }));
  }

}
