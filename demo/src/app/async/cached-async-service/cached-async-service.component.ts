import { Component } from '@angular/core';

import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1CachedService } from '../f1.service';

@Component({
  selector: 'app-cached-async-service',
  templateUrl: './cached-async-service.component.html',
  imports: [DriverListItemComponent]
})
export class CachedAsyncServiceComponent {

  drivers?: Driver[];

  constructor(private service: F1CachedService) {
    this.service.getDrivers().subscribe(drivers => this.drivers = drivers);
  }

  addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }
}
