import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Observable, debounceTime } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { DefaultDescriptionPipe } from '../pipe/default-description.pipe';
import { DistancePipe } from '../pipe/distance.pipe';
import { HumanizeDistancePipe } from '../pipe/humanize-distance.pipe';
import { LocationService } from '../service';

@Component({
    selector: 'loop-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        FontAwesomeModule,
        AsyncPipe,
        DistancePipe,
        HumanizeDistancePipe,
        DefaultDescriptionPipe,
    ]
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
      queryParams: { filter },
      relativeTo: this.route,
      replaceUrl: true,
    }));
  }

}
