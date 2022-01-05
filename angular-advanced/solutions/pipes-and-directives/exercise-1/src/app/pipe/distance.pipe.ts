import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { Coordinate } from '../model';
import { LocationService } from '../service';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform, OnDestroy {

  private lastKnownLocation?: Coordinate;
  private subscription: Subscription;

  constructor(private locationService: LocationService) {
    this.subscription = locationService.location$.subscribe(location => this.lastKnownLocation = location);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  transform(value: Coordinate): number | string {
    return this.lastKnownLocation ? this.locationService.getDistance(this.lastKnownLocation, value) : 'Ukendt';
  }

}
