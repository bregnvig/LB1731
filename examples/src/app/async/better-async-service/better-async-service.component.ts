import { Component, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import { Driver } from '../driver';
import { F1BetterService } from '../f1.service';

@Component({
  moduleId: module.id,
  selector: 'app-better-async-service',
  templateUrl: 'better-async-service.component.html',
  styleUrls: ['better-async-service.component.css'],
  providers: [HTTP_PROVIDERS, F1BetterService]
})
export class BetterAsyncServiceComponent  {

  public drivers: Driver[];

  constructor(private service: F1BetterService) {
    service.getDrivers().subscribe(drivers => this.drivers = drivers);
  }

  public addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }

}
