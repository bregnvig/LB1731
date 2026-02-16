import { Component, inject, signal } from '@angular/core';

import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1CachedService } from '../f1.service';

@Component({
  selector: 'app-cached-async-service',
  templateUrl: './cached-async-service.component.html',
  imports: [DriverListItemComponent]
})
export class CachedAsyncServiceComponent {

  protected drivers = signal<Driver[] | undefined>(undefined);
  #service = inject(F1CachedService);

  constructor() {
    this.#service.getDrivers().subscribe(drivers => this.drivers.set(drivers));
  }

  protected addSubscribtion() {
    this.#service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }
}
