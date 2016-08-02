import { Component, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import { Driver } from '../driver';
import { F1BestService } from '../f1.service';

@Component({
  moduleId: module.id,
  selector: 'app-best-async-service',
  templateUrl: 'best-async-service.component.html',
  styleUrls: ['best-async-service.component.css'],
  providers: [HTTP_PROVIDERS, F1BestService]
})
export class BestAsyncServiceComponent {

  public drivers: Driver[];

  constructor(private service: F1BestService) {
    const sub = service.getDrivers().subscribe(drivers => {
      this.drivers = drivers
    });
  }

  public addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }
}
