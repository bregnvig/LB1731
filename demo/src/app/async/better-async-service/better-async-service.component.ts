import { Component, OnInit } from '@angular/core';

import { NgOptimizedImage } from '@angular/common';
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

  drivers?: Driver[];

  constructor(private service: F1BetterService) {
    this.service.getDrivers().subscribe(drivers => this.drivers = drivers);
  }

  addSubscription() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
