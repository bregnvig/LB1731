import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { RetryService } from '../retry.service';
@Component({
  selector: 'app-retry-when',
  template: `
    <h2>Retry when Service</h2>
    <ul class="list-group">
      @for(driver of drivers(); track driver.driverNumber) {
        <app-driver-list-item [driver]="driver"/>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DriverListItemComponent]
})
export class RetryWhenComponent implements OnInit {

  protected drivers = signal<Driver[] | undefined>(undefined);
  #service = inject(RetryService);

  constructor() { }

  ngOnInit() {
    this.#service.drivers$.subscribe({
      next: drivers => this.drivers.set(drivers),
      error: console.error
    });
  }

}
