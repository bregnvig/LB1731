import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { combineLatest, interval, merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, repeat, startWith, tap } from 'rxjs/operators';
import { LocationService, Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-rxjs-way-refresh',
  templateUrl: './rxjs-way-refresh.component.html',
  styleUrls: ['./rxjs-way-refresh.component.scss']
})
export class RxJSWayRefreshComponent implements OnInit {

  filterControl = new UntypedFormControl();
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

    // Using two different style by design
    const filteredPlaygrounds$ = combineLatest([
      this.service.playgrounds$.pipe(
        repeat({ delay: () => refresh$ }),
      ),
      // refresh$.pipe(
      //   switchMap(() => this.service.playgrounds$),
      // ),
      this.filterControl.valueChanges.pipe(
        debounceTime(400),
        startWith(''),
        map((term: string) => new RegExp(term, 'i'))
      )
    ]).pipe(
      tap(_ => console.log(_)),
      map(([playgrounds, term]) => playgrounds.filter(p => term.test(p.name)))
    );
    const getDistance = this.locationService.getDistance;
    this.playgrounds$ = combineLatest({
      location: this.locationService.location$,
      playgrounds: filteredPlaygrounds$,
    }).pipe(
      map(({ playgrounds, location }) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }
}
