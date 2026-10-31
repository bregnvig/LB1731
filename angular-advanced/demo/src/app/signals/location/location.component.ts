
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';
import { LocationWithSignalsComponent } from "./location-with-signals.component";
import { LocationWithRxjsComponent } from "./location-with-rxjs.component";

@Component({
    selector: 'loop-location',
    imports: [LocationWithSignalsComponent, LocationWithRxjsComponent],
    template: `
    <div class="container">
      <div class="row gx-4">
        <div class="col">
          <section class="feed">
            <header>
              <h4>With rxjs</h4>
              <code>location$.subscribe()</code>
            </header>
            <div class="body">
              <loop-location-with-rxjs/>
            </div>
          </section>
        </div>
        <div class="col">
          <section class="feed">
            <header>
              <h4>With signals</h4>
              <code>toSignal(location$)</code>
            </header>
            <div class="d-flex flex-column body">
              <div class="spacer" aria-hidden="true"></div>
              <loop-location-with-signals/>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.Eager,
    styles: `
      @import "src/scss/variables";
      @import "../feed";

      // keeps the signals column level with the rxjs buttons
      .spacer {
        height: 2.5rem;
      }

      :host ::ng-deep .leaflet-container {
        margin-top: 1rem;
        border-radius: $border-radius-lg;
      }
    `
})
export class LocationComponent { }
