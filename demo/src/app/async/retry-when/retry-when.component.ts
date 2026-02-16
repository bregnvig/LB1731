import { Component, OnInit, inject, signal } from '@angular/core';
import { Driver } from '../driver';
import { DriverListItemComponent } from "../driver-list-item.component";
import { RetryService } from '../retry.service';
@Component({
  selector: 'app-retry-when',
  templateUrl: './retry-when.component.html',
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
