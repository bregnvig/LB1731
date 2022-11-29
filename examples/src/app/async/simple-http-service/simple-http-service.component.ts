import { Component, OnInit } from '@angular/core';

import { Driver } from '../driver';
import { F1SimpleService } from '../f1.service';

@Component({
  selector: 'app-simple-http-service',
  template: `
    <h2>Simple HTTP Service</h2>
    <ul class="list-group">
      <li *ngFor="let driver of drivers" class="list-group-item">
        {{driver.givenName}} {{driver.familyName}}
      </li>
    </ul>
  `,
})
export class SimpleHttpServiceComponent implements OnInit {

  drivers?: Driver[];

  constructor(private service: F1SimpleService) {
  }

  ngOnInit() {
    this.service.getDrivers().subscribe(response => this.drivers = response.MRData.DriverTable.Drivers);
  }
}
