import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver';
import { F1CachedService } from '../f1.service';

@Component({
  selector: 'app-cached-async-service',
  templateUrl: './cached-async-service.component.html',
  styleUrls: ['./cached-async-service.component.css'],
  providers: [F1CachedService]
})
export class CachedAsyncServiceComponent implements OnInit {

  public drivers: Driver[];

  constructor(private service: F1CachedService) {
  }

  public ngOnInit() {
    this.service.getDrivers().subscribe(drivers => {
      this.drivers = drivers
    });
  }

  public addSubscribtion() {
    this.service.getDrivers().subscribe(drivers => console.log(`Found ${drivers.length} drivers`));
  }
}
