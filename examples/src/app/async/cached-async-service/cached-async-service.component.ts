import { Component, OnInit } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import { Driver } from '../driver';
import { F1CachedService } from '../f1.service';

@Component({
  moduleId: module.id,
  selector: 'app-cached-async-service',
  templateUrl: 'cached-async-service.component.html',
  styleUrls: ['cached-async-service.component.css'],
  providers: [HTTP_PROVIDERS, F1CachedService]
})
export class CachedAsyncServiceComponent {

  public drivers: Driver[];

  constructor(private service: F1CachedService) {
    const sub = service.getDrivers().subscribe(drivers => {
      this.drivers = drivers
    });
  }

  public addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }
}
