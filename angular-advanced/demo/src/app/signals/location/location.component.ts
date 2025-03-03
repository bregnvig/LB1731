
import { Component } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';
import { LocationWithSignalsComponent } from "./location-with-signals.component";
import { LocationWithRxjsComponent } from "./location-with-rxjs.component";

@Component({
    selector: 'loop-location',
    imports: [LocationWithSignalsComponent, LocationWithRxjsComponent],
    template: `
    <div class="container">
      <div class="row gx-5">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h4>With rxjs</h4>
              <loop-location-with-rxjs/>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="d-flex flex-column card-body">
              <h4 [style.margin-bottom.px]="46">With signals</h4>
              <loop-location-with-signals/>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class LocationComponent { }
