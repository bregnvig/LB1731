import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { Coordinate } from '../model';
import { LocationService } from '../service';

const distanceKeyFn = (a: Coordinate, b: Coordinate) => `${a.lat}${a.lng}${b.lat}${b.lng}`;
@Pipe({
  name: 'distance',
  pure: false,
})
export class DistancePipe implements PipeTransform, OnDestroy {

  private distanceKey?: string;
  private distance: number | string = 'Ukendt';
  private lastKnownLocation!: Coordinate;
  private subscription: Subscription;

  constructor(private locationService: LocationService) {
    this.subscription = locationService.location$.subscribe(location => this.lastKnownLocation = location);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  transform(value: Coordinate): number | string {
    const key = distanceKeyFn(this.lastKnownLocation, value);
    if(key !== this.distanceKey) {
      this.distanceKey = key;
      this.distance = this.locationService.getDistance(this.lastKnownLocation, value);
    }
    return this.distance;
  }

}
