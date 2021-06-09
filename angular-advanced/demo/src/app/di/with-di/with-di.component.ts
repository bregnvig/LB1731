import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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
    this.playgrounds$ = this.service.playgrounds$;
    this.location$ = this.locationService.location$;
  }
}
