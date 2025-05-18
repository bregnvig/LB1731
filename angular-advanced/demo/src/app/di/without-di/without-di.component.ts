import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate, LocationService, Playground, PlaygroundService } from 'src/app/shared';
import { AarhusPlaygroundService } from '../service/playground.service';

@Component({
  selector: 'loop-without-di',
  templateUrl: './without-di.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class WithoutDIComponent implements OnInit {

  playgrounds$: Observable<Playground[]> | undefined;
  location$: Observable<Coordinate>;

  private service: PlaygroundService;

  constructor() {
    this.service = new AarhusPlaygroundService();
    this.location$ = new LocationService().location$;
  }

  ngOnInit(): void {
    this.playgrounds$ = this.service.playgrounds$;
  }
}
