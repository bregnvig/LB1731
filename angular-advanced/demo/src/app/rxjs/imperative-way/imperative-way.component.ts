import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Coordinate, LocationService, Playground, PlaygroundService } from 'src/app/shared';

@UntilDestroy()
@Component({
  selector: 'loop-imperative-way',
  templateUrl: './imperative-way.component.html',
  styleUrls: ['./imperative-way.component.scss']
})
export class ImperativeWayComponent implements OnInit {

  playgrounds: Playground[] = [];
  term: string = '';
  trackById = (i: number, playground: Playground) => playground.id;

  private fetchedPlaygrounds: Playground[] = this.playgrounds;
  private location: Coordinate | undefined;
  private fetchFailed = false;

  constructor(private service: PlaygroundService, private locationService: LocationService) { }

  ngOnInit(): void {
    this.fetchPlaygrounds();
    this.locationService.location$.pipe(untilDestroyed(this)).subscribe(
      location => this.updateLocation(location),
    );
    window.addEventListener('online', () => this.fetchFailed && this.fetchPlaygrounds());
  }

  fetchPlaygrounds(): void {
    this.service.playgrounds$.subscribe({
      next: playgrounds => this.setPlaygrounds(playgrounds),
      error: error => error instanceof HttpErrorResponse && !window.navigator.onLine && (this.fetchFailed = true),
      complete: () => console.log('Complete'),
    });
  }

  filterPlaygrounds() {
    const term = this.term.toLocaleLowerCase();
    this.playgrounds = this.fetchedPlaygrounds.filter(p => p.name.toLocaleLowerCase().includes(term));
    // Lets say I forgot to call this here
    // this.sortPlaygrounds();
  }

  getDistance(playground: Playground): string | undefined {
    return this.location && `${Math.round(this.locationService.getDistance(playground.position, this.location))}m`;
  }

  private setPlaygrounds(playgrounds: Playground[]) {
    this.fetchFailed = false;
    this.fetchedPlaygrounds = playgrounds;
    this.filterPlaygrounds();
    this.sortPlaygrounds();
  }

  private updateLocation(location: Coordinate) {
    console.log('Location updated', location);

    this.location = location;
    this.sortPlaygrounds();
  }

  private sortPlaygrounds() {
    if (this.location && this.playgrounds?.length) {
      const getDistance = this.locationService.getDistance;
      const location = this.location;
      const sortFn = (a: Playground, b: Playground) => getDistance(a.position, location) - getDistance(b.position, location);
      this.playgrounds.sort(sortFn);
    }
  }

}
