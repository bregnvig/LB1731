import { DestroyRef, Pipe, PipeTransform, inject } from '@angular/core';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Pipe({
  name: 'distance',
  standalone: true
})
export class DistancePipe implements PipeTransform {

  private location?: Coordinate;

  constructor(private locationService: LocationService) {
    const subscription = locationService.location$.subscribe(location => this.location = location);
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  }

  transform(value: Coordinate): `${number}m` | 'Unknown location' {
    return this.location
      ? `${this.locationService.getDistance(this.location, value)}m`
      : 'Unknown location';
  }

}
