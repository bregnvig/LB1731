import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver';
import { F1SimpleService } from '../f1.service';

@Component({
  selector: 'app-simple-http-service',
  templateUrl: './simple-http-service.component.html',
  styleUrls: ['./simple-http-service.component.css'],
  providers: [F1SimpleService]
})
export class SimpleHttpServiceComponent {

  public drivers: Driver[];

  constructor(service: F1SimpleService) {
    service.getDrivers().subscribe(response => this.drivers = response.json().MRData.DriverTable.Drivers);
  }
}
