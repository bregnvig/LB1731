import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from 'src/app/shared';
import { createOptions } from './create-options';

@Component({
    selector: 'loop-location-with-signals',
    imports: [NgbAlert, JsonPipe, LeafletModule],
    template: `
    <ngb-alert type="info" class="mt-3" [dismissible]="false">
      <code><pre class="text-white mb-0">{{location() | json}}</pre></code>
    </ngb-alert>
    @if (options(); as options) {
      <div style="height: 500px;"
        leaflet
        [leafletOptions]="options">
      </div>
    }`
})
export class LocationWithSignalsComponent {

  location = toSignal(inject(LocationService).location$)
  options = computed(() => {
    const location = this.location();
    return location ? createOptions(location) : undefined;
  })

}
