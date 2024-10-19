import { DestroyRef, Pipe, PipeTransform, inject } from '@angular/core';
import { Coordinate } from '../model';
import { LocationService } from '../service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const distanceKeyFn = (a: Coordinate, b: Coordinate) => `${a.lat}${a.lng}${b.lat}${b.lng}`;
@Pipe({
  name: 'distance',
  pure: false,
  standalone: true,
})
export class DistancePipe implements PipeTransform {

  private distanceKey?: string;
  private distance: number | 'Unknown location' = 'Unknown location';
  private lastKnownLocation?: Coordinate;

  constructor(private locationService: LocationService) {
    locationService.location$.pipe(
      takeUntilDestroyed()
    ).subscribe(location => this.lastKnownLocation = location);
  }

  transform(value: Coordinate): `${number}m` | 'Unknown location' {
    if (this.lastKnownLocation) {
      const key = distanceKeyFn(this.lastKnownLocation, value);
      if (key !== this.distanceKey) {
        this.distanceKey = key;
        this.distance = this.locationService.getDistance(this.lastKnownLocation, value);
      }

    }
    return typeof this.distance === 'number' ? `${this.distance}m` : 'Unknown location';
  }

}
