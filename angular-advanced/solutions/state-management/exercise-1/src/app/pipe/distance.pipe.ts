import { Pipe, PipeTransform } from '@angular/core';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Pipe({
  name: 'distance',
  pure: false,
  standalone: true,
})

export class DistancePipe implements PipeTransform {

  constructor(private service: LocationService) {
  }

  transform(value: Coordinate): `${number}m` | 'Unknown location' {
    const location = this.service.location();
    return location ? `${this.service.getDistance(value, location)}m` : 'Unknown location';
  }
}