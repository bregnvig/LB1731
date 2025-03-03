import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coordinate, LocationService, Playground, PlaygroundService } from 'src/app/shared';

@Component({
    selector: 'loop-with-injector',
    templateUrl: '../without-di/without-di.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class WithInjectorComponent implements OnInit {

  playgrounds$: Observable<Playground[]> | undefined;
  location$: Observable<Coordinate> | undefined;

  constructor(private injector: Injector) { }

  ngOnInit(): void {
    const locationService = this.injector.get(LocationService);
    this.location$ = locationService.location$;
    const d = locationService.getDistance;
    const service: PlaygroundService = this.injector.get(PlaygroundService);
    this.playgrounds$ = combineLatest([service.playgrounds$, this.location$]).pipe(
      map(([playgrounds, location]) => playgrounds.sort((a, b) => d(a.position, location) - d(b.position, location)))
    );
  }
}
