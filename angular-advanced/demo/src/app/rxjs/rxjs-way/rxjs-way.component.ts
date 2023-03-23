import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { combineLatest, debounceTime, map, Observable, startWith } from "rxjs";
import { LocationService, Playground, PlaygroundService } from "src/app/shared";

@Component({
  selector: 'loop-rxjs-way',
  templateUrl: './rxjs-way.component.html',
  styleUrls: ['./rxjs-way.component.scss']
})
export class RxJSWayComponent implements OnInit {

  filterControl = new FormControl<string>('', { nonNullable: true });
  playgrounds$: Observable<Playground[]> | undefined;
  location$ = this.locationService.location$;
  trackById = (i: number, playground: Playground): string => playground.id;

  constructor(private service: PlaygroundService, private locationService: LocationService) { }

  ngOnInit(): void {
    const playgrounds$ = combineLatest([
      this.service.playgrounds$,
      this.filterControl.valueChanges.pipe(
        debounceTime(300),
        startWith(''),
        map(term => term.toLocaleLowerCase()),
      ),
    ]).pipe(
      map(([playgrounds, term]) => playgrounds.filter(p => p.name.toLocaleLowerCase().includes(term)))
    );
    const getDistance = this.locationService.getDistance;
    this.playgrounds$ = combineLatest([playgrounds$, this.locationService.location$]).pipe(
      map(([playgrounds, location]) =>
        playgrounds.sort((a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location))
      )
    );
  }
}