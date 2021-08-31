import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coordinate, LocationService, Playground } from 'src/app/shared';
import { AarhusPlaygroundService } from '../service/playground.service';

@Component({
  selector: 'loop-with-di',
  templateUrl: '../without-di/without-di.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithDIComponent implements OnInit {

  playgrounds$: Observable<Playground[]> | undefined;
  location$: Observable<Coordinate> | undefined;

  constructor(private locationService: LocationService, private service: AarhusPlaygroundService) { }

  ngOnInit(): void {
    const d = this.locationService.getDistance;
    this.location$ = this.locationService.location$;
    this.playgrounds$ = combineLatest([this.service.playgrounds$, this.location$]).pipe(
      map(([playgrounds, location]) => playgrounds.sort((a, b) => d(a.position, location) - d(b.position, location)))
    );
  }
}
