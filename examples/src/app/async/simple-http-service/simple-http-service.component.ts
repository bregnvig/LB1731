import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver';
import { F1SimpleService } from '../f1.service';

@Component({
  selector: 'app-simple-http-service',
  templateUrl: './simple-http-service.component.html',
})
export class SimpleHttpServiceComponent implements OnInit {

  public drivers: Driver[];

  constructor(private service: F1SimpleService) {
  }

  public ngOnInit() {
    this.service.getDrivers().subscribe(response => this.drivers = response.MRData.DriverTable.Drivers);
  }
}
