import { Component, signal } from '@angular/core';

import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1CachedService } from '../f1.service';

@Component({
  selector: 'app-cached-async-service',
  templateUrl: './cached-async-service.component.html',
  imports: [DriverListItemComponent]
})
export class CachedAsyncServiceComponent {

  drivers = signal<Driver[] | undefined>(undefined);

  constructor(private service: F1CachedService) {
    this.service.getDrivers().subscribe(drivers => this.drivers.set(drivers));
  }

  addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }
}
