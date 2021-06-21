import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, exhaustMap, map, startWith, tap } from 'rxjs/operators';
import { LocationService, Playground, PlaygroundService } from 'src/app/shared';
import { useCacheOnError } from '../rxjs-utils';

@Component({
  selector: 'loop-rxjs-way',
  templateUrl: './rxjs-way.component.html',
  styleUrls: ['./rxjs-way.component.scss']
})
export class RxJSWayComponent implements OnInit {

  filterControl = new FormControl();
  playgrounds$: Observable<Playground[]> | undefined;
  refresh$ = new BehaviorSubject<void>(undefined);
  location$ = this.locationService.location$;
  trackById = (i: number, playground: Playground): string => playground.id;

  constructor(private service: PlaygroundService, private locationService: LocationService) { }

  ngOnInit(): void {
    const playgrounds$ = combineLatest([
      this.refresh$.pipe(exhaustMap(() => this.service.playgrounds$.pipe(useCacheOnError('playgrounds')))),
      this.filterControl.valueChanges.pipe(
        debounceTime<string>(300),
        tap(_ => console.log(_)),
        startWith(''),
        map(term => term.toLocaleLowerCase())
      ),
    ]).pipe(
      map(([playgrounds, term]) => playgrounds.filter(p => p.name.toLocaleLowerCase().includes(term)))
    );
    const getDistance = this.locationService.getDistance;
    this.playgrounds$ = combineLatest([
      playgrounds$,
      this.locationService.location$
    ]).pipe(
      map(([playgrounds, location]) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    )
  }
}
