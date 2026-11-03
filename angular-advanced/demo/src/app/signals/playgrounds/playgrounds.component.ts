
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PlaygroundsWithRxjsComponent } from "./playgrounds-with-rxjs.component";
import { PlaygroundsWithSignalsComponent } from "./playgrounds-with-signals.component";

@Component({
  selector: 'loop-playgrounds',
  imports: [PlaygroundsWithRxjsComponent, PlaygroundsWithSignalsComponent],
  template: `
    <div class="container">
      <div class="row gx-4">
        <div class="col">
          <section class="feed">
            <header>
              <h4>With rxjs</h4>
              <code>timer(0, 5000).pipe(switchMap(...)).subscribe()</code>
            </header>
            <div class="body">
              <loop-playgrounds-with-rxjs/>
            </div>
          </section>
        </div>
        <div class="col">
          <section class="feed">
            <header>
              <h4>With signals</h4>
              <code>toSignal(timer(0, 5000).pipe(switchMap(...)))</code>
            </header>
            <div class="body">
              <div class="spacer" aria-hidden="true"></div>
              <loop-playgrounds-with-signals/>
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

    // keeps the signals list level with the rxjs list under its buttons
    .spacer {
      height: 3.5rem;
    }
  `
})
export class PlaygroundsComponent { }
