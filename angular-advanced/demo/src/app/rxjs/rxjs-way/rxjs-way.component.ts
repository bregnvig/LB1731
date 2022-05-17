import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, interval, merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, repeatWhen, startWith, tap } from 'rxjs/operators';
import { LocationService, Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-rxjs-way',
  templateUrl: './rxjs-way.component.html',
  styleUrls: ['./rxjs-way.component.scss']
})
export class RxJSWayComponent implements OnInit {

  filterControl = new FormControl();
  playgrounds$: Observable<Playground[]> | undefined;
  refresh$ = new Subject<void>();
  location$ = this.locationService.location$;
  trackById = (i: number, playground: Playground): string => playground.id;

  constructor(private service: PlaygroundService, private locationService: LocationService) { }

  ngOnInit(): void {
    const refresh$ = merge(
      this.refresh$,
      interval(10000),
    );
    const playgrounds$ = combineLatest([
      this.service.playgrounds$.pipe(
        repeatWhen(() => refresh$),
        // tap(_ => localStorage.setItem('playgrounds', JSON.stringify(_))),
        // catchError(() => of(JSON.parse(localStorage.getItem('playgrounds') || '[]')))
      ),
      this.filterControl.valueChanges.pipe(
        debounceTime(400),
        startWith(''),
        map((term: string) => new RegExp(term, 'i'))
      )
    ]).pipe(
      tap(_ => console.log(_)),
      map(([playgrounds, term]: [Playground[], RegExp]) => playgrounds.filter(p => term.test(p.name)))
    );
    const getDistance = this.locationService.getDistance;
    this.playgrounds$ = combineLatest({
      location: this.locationService.location$,
      playgrounds: playgrounds$,
    }).pipe(
      map(({ playgrounds, location }) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }
}
