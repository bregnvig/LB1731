import { Component, inject, Signal, signal } from '@angular/core';

import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1BetterService } from '../f1.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-better-async-service',
  templateUrl: './better-async-service.component.html',
  providers: [F1BetterService],
  imports: [DriverListItemComponent],
})
export class BetterAsyncServiceComponent {

  protected drivers: Signal<Driver[] | undefined>;
  #service = inject(F1BetterService);

  constructor() {
    this.drivers = toSignal(this.#service.getDrivers());
  }

  protected addSubscription() {
    this.#service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
