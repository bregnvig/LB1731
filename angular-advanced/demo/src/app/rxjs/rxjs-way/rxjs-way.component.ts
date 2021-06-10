import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, fromEvent, Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, map, retryWhen, startWith, switchMap } from 'rxjs/operators';
import { LocationService, Playground, PlaygroundService } from 'src/app/shared';
import { debug } from '../rxjs-utils';

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

  constructor(private service: PlaygroundService, private locationService: LocationService) {
  }

  ngOnInit(): void {
    const playgrounds$ = this.refresh$.pipe(
      switchMap(() => this.service.playgrounds$),
      debug('playgrounds'),
      // useCacheOnError('playgrounds'),
      retryWhen(error => window.navigator.onLine ? throwError(error) : fromEvent(window, 'online')),
      catchError(() => of(JSON.parse(localStorage.getItem('playgrounds') || '[]') as Playground[]))
    );
    const filtered$ = combineLatest([
      playgrounds$,
      this.filterControl.valueChanges.pipe(debounceTime<string>(300), startWith(''), map(term => term.toLocaleLowerCase())),
    ]).pipe(
      map(([playgrounds, term]) => playgrounds.filter(p => p.name.toLocaleLowerCase().includes(term)))
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
