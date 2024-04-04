import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Coordinate, LocationService, Playground, PlaygroundService } from 'src/app/shared';

@Component({
  selector: 'loop-imperative-way',
  templateUrl: './imperative-way.component.html',
  styleUrls: ['./imperative-way.component.scss']
})
export class ImperativeWayComponent implements OnInit, OnDestroy {

  playgrounds: Playground[] = [];
  term: string = '';

  private fetchedPlaygrounds: Playground[] = this.playgrounds;
  private location: Coordinate | undefined;
  private fetchFailed = false;
  private watchId: number | undefined;

  constructor(private service: PlaygroundService, private locationService: LocationService) { }

  ngOnInit(): void {
    this.initializeLocation();
    this.fetchPlaygrounds();
    window.addEventListener('online', () => this.fetchFailed && this.fetchPlaygrounds());
  }

  ngOnDestroy(): void {
    this.watchId && window.navigator.geolocation.clearWatch(this.watchId);
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
    console.log('Filtering by', term);
    this.playgrounds = this.fetchedPlaygrounds.filter(p => p.name.toLocaleLowerCase().includes(term));
    // Lets say I forgot to call this here
    this.sortPlaygrounds();
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

  private initializeLocation() {
    this.watchId = window.navigator.geolocation.watchPosition(position => {
      this.updateLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }

}
