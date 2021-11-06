import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, Playground } from '../model';
import { LocationService } from '../service';

@Component({
  selector: 'loop-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {

  @Input() playgrounds: Playground[] | null | undefined = [];
  @Output() selected = new EventEmitter<Playground>();
  @Output() edit = new EventEmitter<Playground>();

  @Input() selectedPlayground: Playground | null | undefined = null;
  location$: Observable<Coordinate> = this.locationService.location$;

  constructor(private locationService: LocationService) { }

}
