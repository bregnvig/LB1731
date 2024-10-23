
import { Component } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { Playground, PlaygroundService } from 'src/app/shared';
import { PlaygroundsWithRxjsComponent } from "./playgrounds-with-rxjs.component";
import { PlaygroundsWithSignalsComponent } from "./playgrounds-with-signals.component";

@Component({
  selector: 'loop-playgrounds',
  standalone: true,
  imports: [PlaygroundsWithRxjsComponent, PlaygroundsWithSignalsComponent],
  template: `
    <div class="container">
      <div class="row gx-5">
        <div class="col">
              <h4>With rxjs</h4>
              <loop-playgrounds-with-rxjs/>
            </div>
        <div class="col">
              <h4 [style.margin-bottom.px]="62">With signals</h4>
              <loop-playgrounds-with-signals/>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class PlaygroundsComponent { }
