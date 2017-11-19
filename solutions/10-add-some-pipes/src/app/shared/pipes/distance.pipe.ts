import { Pipe, PipeTransform } from '@angular/core';

import { LocationService } from '../location.service';
import { Coordinate } from '../coordinate';
import { Playground } from '../playground';

@Pipe({
  name: 'distance',
  pure: false
})
export class DistancePipe implements PipeTransform {

  private currentLocation: Coordinate;
  private distance: number;

  constructor(private locationService: LocationService) {
    this.locationService.current.subscribe(location => {
      this.currentLocation = location;
      this.distance = null;
    });
  }

  public transform(value: Coordinate): number | string {
    if (this.distance) {
      return this.distance;
    }
    if (this.currentLocation) {
      return this.distance = this.locationService.getDistance(this.currentLocation, value);
    }
    return 'Ukendt';
  }

}
