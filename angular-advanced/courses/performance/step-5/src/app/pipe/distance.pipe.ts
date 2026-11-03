import { Pipe, PipeTransform } from '@angular/core';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Pipe({
  name: 'distance',
  standalone: true,
})

export class DistancePipe implements PipeTransform {

  constructor(private service: LocationService) {
  }

  transform(value: Coordinate, other: Coordinate | undefined): `${number}m` | 'Unknown location' {
    return value && other ? `${this.service.getDistance(value, other)}m` : 'Unknown location';
  }
}
