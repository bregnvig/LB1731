import { Component, OnInit, inject, signal } from '@angular/core';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1LocalStorageCache } from '../f1.service';

@Component({
  selector: 'app-catch-error',
  templateUrl: './catch-error.component.html',
  imports: [DriverListItemComponent]
})
export class CatchErrorComponent implements OnInit {
  protected drivers = signal<Driver[] | undefined>(undefined);
  #service = inject(F1LocalStorageCache);

  constructor() {
  }

  ngOnInit() {
    this.#service.getDrivers().subscribe(drivers => {
      this.drivers.set(drivers);
    });
  }

  protected addSubscribtion() {
    this.#service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
