import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { LocationService, Playground, PlaygroundService } from 'src/app/shared';

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
      this.refresh$.pipe(
        switchMap(() => this.service.playgrounds$),
        tap(_ => localStorage.setItem('playgrounds', JSON.stringify(_))),
        catchError(() => of(JSON.parse(localStorage.getItem('playgrounds') || '[]')))
      ),
      this.filterControl.valueChanges.pipe(debounceTime(400), startWith(''), map((term: string) => term.toLowerCase()))
    ]).pipe(
      tap(_ => console.log(_)),
      map(([playgrounds, term]: [Playground[], string]) => playgrounds.filter(p => p.name.toLowerCase().includes(term)))
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
