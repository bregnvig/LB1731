import { Pipe, PipeTransform } from '@angular/core';
import { Coordinate, Playground } from 'src/app/model';
import { LocationService } from 'src/app/service';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  constructor(private service: LocationService) { }

  transform({ position }: Playground, location: Coordinate | null): string | null {
    return location && `${Math.floor(this.service.getDistance(position, location))}m`;
  }
}
