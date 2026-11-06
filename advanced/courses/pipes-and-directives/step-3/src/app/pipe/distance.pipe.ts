import { inject, Pipe, PipeTransform } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Pipe({
  name: 'distance',
  pure: false,
})
export class DistancePipe implements PipeTransform {

  #locationService = inject(LocationService);
  #location?: Coordinate;

  constructor() {
    this.#locationService.location$.pipe(
      takeUntilDestroyed()
    ).subscribe(location => this.#location = location);
  }

  transform(value: Coordinate | undefined | null): `${number}m` | 'Unknown location' {
    return this.#location && value
      ? `${this.#locationService.getDistance(this.#location, value)}m`
      : 'Unknown location';
  }

}
