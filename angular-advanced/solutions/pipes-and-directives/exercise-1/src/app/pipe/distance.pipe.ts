import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Pipe({
    name: 'distance',
    standalone: true
})
export class DistancePipe implements PipeTransform, OnDestroy {

  private location?: Coordinate;
  private subscription: Subscription;

  constructor(private locationService: LocationService) {
    this.subscription = locationService.location$.subscribe(location => this.location = location);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  transform(value: Coordinate): `${number}m` | 'Unknown location' {
    return this.location
      ? `${this.locationService.getDistance(this.location, value)}m`
      : 'Unknown location';
  }

}
