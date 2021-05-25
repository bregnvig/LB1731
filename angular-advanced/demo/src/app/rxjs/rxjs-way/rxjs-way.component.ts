import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, fromEvent, Observable, throwError } from 'rxjs';
import { debounceTime, map, retryWhen, startWith } from 'rxjs/operators';
import { Playground } from 'src/app/model';
import { LocationService, PlaygroundService } from 'src/app/service';

@Component({
  selector: 'loop-rxjs-way',
  templateUrl: './rxjs-way.component.html',
  styleUrls: ['./rxjs-way.component.scss']
})
export class RxJSWayComponent implements OnInit {

  filterControl = new FormControl();
  playgrounds$: Observable<Playground[]> | undefined;
  location$ = this.locationService.location$;
  trackById = (i: number, playground: Playground) => playground.id;

  constructor(private service: PlaygroundService, private locationService: LocationService) { }

  ngOnInit(): void {
    const filtered$ = combineLatest([
      this.service.playgrounds$.pipe(retryWhen(() => window.navigator.onLine ? throwError('Unknown error') : fromEvent(window, 'online'))),
      this.filterControl.valueChanges.pipe(debounceTime<string>(300), startWith(''), map(term => term.toLocaleLowerCase())),
    ]).pipe(
      map(([playgrounds, term]) => playgrounds.filter(p => p.name.includes(term)))
    );
    const getDistance = this.locationService.getDistance;
    this.playgrounds$ = combineLatest([
      filtered$,
      this.locationService.location$
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    )
  }
}
