import { Component, signal } from '@angular/core';

import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1BetterService } from '../f1.service';

@Component({
  selector: 'app-better-async-service',
  templateUrl: './better-async-service.component.html',
  providers: [F1BetterService],
  imports: [DriverListItemComponent],
})
export class BetterAsyncServiceComponent {

  drivers = signal<Driver[] | undefined>(undefined);

  constructor(private service: F1BetterService) {
    service.getDrivers().subscribe(drivers => this.drivers.set(drivers));
  }

  addSubscription() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
