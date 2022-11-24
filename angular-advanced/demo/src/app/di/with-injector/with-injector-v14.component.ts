import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coordinate, LocationService, Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-with-injector-v14',
  templateUrl: '../without-di/without-di.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithInjectorV14Component {

  playgrounds$: Observable<Playground[]> | undefined;
  location$: Observable<Coordinate> | undefined;

  constructor() {
    const locationService = inject(LocationService);
    this.location$ = locationService.location$;
    const d = locationService.getDistance;
    const service: PlaygroundService = inject(PlaygroundService);
    this.playgrounds$ = combineLatest([service.playgrounds$, this.location$]).pipe(
      map(([playgrounds, location]) => playgrounds.sort((a, b) => d(a.position, location) - d(b.position, location)))
    );
  }
}
