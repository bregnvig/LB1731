import { Component, OnInit } from '@angular/core';
import { Coordinate, Playground } from 'src/app/model';
import { LocationService, PlaygroundService } from 'src/app/service';

@Component({
  selector: 'app-imperative-way',
  templateUrl: './imperative-way.component.html',
  styleUrls: ['./imperative-way.component.scss']
})
export class ImperativeWayComponent implements OnInit {

  playgrounds: Playground[] = [];
  term: string = '';

  private fetchedPlaygrounds: Playground[] = this.playgrounds;
  private location: Coordinate | undefined;

  constructor(private service: PlaygroundService, private locationService: LocationService) { }

  ngOnInit(): void {
    this.fetchPlaygrounds();
    this.locationService.location$.subscribe(location => this.updateLocation(location));
  }

  fetchPlaygrounds(): void {
    this.service.playgrounds$.subscribe(playgrounds => this.setPlaygrounds(playgrounds));
  }

  filterPlaygrounds() {
    const term = this.term.toLocaleLowerCase();
    this.playgrounds = this.fetchedPlaygrounds.filter(p => p.name.toLocaleLowerCase().includes(term));
  }

  private setPlaygrounds(playgrounds: Playground[]) {
    this.fetchedPlaygrounds = playgrounds;
    this.filterPlaygrounds();
    this.sortPlaygrounds();
  }

  private updateLocation(location: Coordinate) {
    this.location = location;
    this.sortPlaygrounds();
  }

  private sortPlaygrounds() {
    if (this.playgrounds?.length && this.location) {
      const getDistance = this.locationService.getDistance;
      const sortFn = (a: Playground, b: Playground) => getDistance(a.position, this.location!) - getDistance(b.position, this.location!);
      this.playgrounds.sort(sortFn);
    }
  }

}
