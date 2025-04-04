import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';
import { DefaultDescriptionPipe } from '../pipe/default-description.pipe';
import { DistancePipe } from '../pipe/distance.pipe';
import { AsyncPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IsInRoleDirective } from '../directive/is-in-role.directive';

@Component({
    selector: 'loop-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [
        IsInRoleDirective,
        FaIconComponent,
        AsyncPipe,
        DistancePipe,
        DefaultDescriptionPipe,
    ]
})
export class SidebarComponent {

  @Input() playgrounds: Playground[] | null = [];
  @Output() selected = new EventEmitter<Playground>();
  @Output() edit = new EventEmitter<Playground>();

  selectedPlayground: Playground | undefined;
  location$: Observable<Coordinate> = this.locationService.location$;

  constructor(private locationService: LocationService) { }

  selectPlayground(playground: Playground): void {
    this.selectedPlayground = playground;
    this.selected.emit(playground);
  }

}
