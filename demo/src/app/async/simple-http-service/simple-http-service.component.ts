import { Component, signal } from '@angular/core';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { F1SimpleService } from '../f1.service';

@Component({
  selector: 'app-simple-http-service',
  template: `
    <h2>Simple HTTP Service</h2>
    <ul class="list-group">
      @for(driver of drivers(); track driver.driverNumber) {
        <app-driver-list-item [driver]="driver"/>
      }
    </ul>
  `,
  imports: [DriverListItemComponent]
})
export class SimpleHttpServiceComponent {

  drivers = signal<Driver[] | undefined>(undefined);

  constructor(private service: F1SimpleService) {
    this.service.getDrivers().subscribe(response => this.drivers.set(response.map((driver: any) => ({
      driverNumber: driver.driver_number.toString(),
      firstName: driver.first_name,
      photoURL: driver.headshot_url,
      lastName: driver.last_name,
    }))));
  }

}
