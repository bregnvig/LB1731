import { inject, Pipe, PipeTransform } from '@angular/core';
import { LocationService } from '../service/location.service';
import { Coordinate } from '../model/coordinate';

@Pipe({
  name: 'distance',
  standalone: true,
})
export class DistancePipe implements PipeTransform {

  private locationService = inject(LocationService);

  transform(value: Coordinate, location: Coordinate | null): number | string {
    return location ? this.locationService.getDistance(location, value) : 'Ukendt';
  }

}
