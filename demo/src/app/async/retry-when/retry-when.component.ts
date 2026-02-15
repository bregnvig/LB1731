import { Component, OnInit, signal } from '@angular/core';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { RetryService } from '../retry.service';
@Component({
  selector: 'app-retry-when',
  templateUrl: './retry-when.component.html',
  imports: [DriverListItemComponent]
})
export class RetryWhenComponent implements OnInit {

  drivers = signal<Driver[] | undefined>(undefined);

  constructor(private service: RetryService) { }

  ngOnInit() {
    this.service.drivers$.subscribe({
      next: drivers => this.drivers.set(drivers),
      error: console.error
    });
  }

}
