import { Pipe, PipeTransform } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Pipe({
  name: 'distance',
  standalone: true
})
export class DistancePipe implements PipeTransform {

  private location?: Coordinate;

  constructor(private locationService: LocationService) {
    locationService.location$.pipe(
      takeUntilDestroyed()
    ).subscribe(location => this.location = location);
  }

  transform(value: Coordinate | undefined | null): `${number}m` | 'Unknown location' {
    return this.location && value
      ? `${this.locationService.getDistance(this.location, value)}m`
      : 'Unknown location';
  }

}
