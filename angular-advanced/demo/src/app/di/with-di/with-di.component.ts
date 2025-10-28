import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coordinate, LocationService, Playground } from 'src/app/shared';
import { AarhusPlaygroundService } from '../service/playground.service';

@Component({
  selector: 'loop-with-di',
  templateUrl: '../without-di/without-di.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class WithDIComponent {

  playgrounds$: Observable<Playground[]>;
  location$: Observable<Coordinate>;

  constructor() {
    const locationService = inject(LocationService);
    const service = inject(AarhusPlaygroundService);
    const d = locationService.getDistance;
    this.location$ = locationService.location$;
    this.playgrounds$ = combineLatest([service.playgrounds$, this.location$]).pipe(
      map(([playgrounds, location]) => playgrounds.sort((a, b) => d(a.position, location) - d(b.position, location)))
    );
  }
}
