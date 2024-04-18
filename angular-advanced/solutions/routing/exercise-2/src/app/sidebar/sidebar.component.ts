import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';
import { DefaultDescriptionPipe } from '../pipe/default-description.pipe';
import { HumanizeDistancePipe } from '../pipe/humanize-distance.pipe';
import { DistancePipe } from '../pipe/distance.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'loop-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgFor,
        RouterLink,
        FontAwesomeModule,
        AsyncPipe,
        DistancePipe,
        HumanizeDistancePipe,
        DefaultDescriptionPipe,
    ],
})
export class SidebarComponent {

  @Input() playgrounds: Playground[] | null | undefined = [];
  @Input() selectedPlayground: Playground | null | undefined = null;
  @Output() edit = new EventEmitter<Playground>();

  location$: Observable<Coordinate> = this.locationService.location$;

  constructor(private locationService: LocationService) { }

}
