import { DestroyRef, Pipe, PipeTransform, inject } from '@angular/core';
import { Coordinate } from '../model';
import { LocationService } from '../service';

const distanceKeyFn = (a: Coordinate, b: Coordinate) => `${a.lat}${a.lng}${b.lat}${b.lng}`;
@Pipe({
  name: 'distance',
  pure: false,
  standalone: true,
})
export class DistancePipe implements PipeTransform {

  private distanceKey?: string;
  private distance: number | 'Unknown location' = 'Unknown location';
  private lastKnownLocation!: Coordinate;

  constructor(private locationService: LocationService) {
    const subscription = locationService.location$.subscribe(location => this.lastKnownLocation = location);
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  transform(value: Coordinate): `${number}m` | 'Unknown location' {
    const key = distanceKeyFn(this.lastKnownLocation, value);
    if (key !== this.distanceKey) {
      this.distanceKey = key;
      this.distance = this.locationService.getDistance(this.lastKnownLocation, value);
    }
    return typeof this.distance === 'number' ? `${this.distance}m` : 'Unknown location';
  }

}
