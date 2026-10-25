import { Pipe, PipeTransform } from '@angular/core';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Pipe({
  name: 'distance',
  pure: false,
  standalone: true,
})

export class DistancePipe implements PipeTransform {

  #location?: Coordinate;

  constructor(private service: LocationService) {
    service.location$.subscribe(location => this.#location = location);
  }

  transform(value: Coordinate): `${number}m` | 'Unknown location' {
    return this.#location ? `${this.service.getDistance(value, this.#location)}m` : 'Unknown location';
  }
}