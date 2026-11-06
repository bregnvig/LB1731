import { Pipe, PipeTransform } from '@angular/core';
import { LocationService } from 'src/app/shared/service';
import { Coordinate, Playground } from '../model';

@Pipe({
    name: 'distance',
    standalone: false
})
export class DistancePipe implements PipeTransform {

  constructor(private service: LocationService) { }

  transform({ position }: Playground, location: Coordinate | null): string | null {
    return location && `${Math.floor(this.service.getDistance(position, location))}m`;
  }
}
