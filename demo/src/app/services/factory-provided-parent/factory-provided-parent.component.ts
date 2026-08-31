import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FactoryProvidedComponent } from '../factory-provided/factory-provided.component';
import { RandomService } from '../random.service';

@Component({
  selector: 'app-factory-provided-parent',
  template: `
    <h2>Factory provided</h2>
    <div class="pane-container center-content">
      <div class="pane fixed-size">
        <p><app-factory-provided/></p>
        <p><app-factory-provided/></p>
        <p><app-factory-provided/></p>
      </div>
    </div>
  `,
  imports: [FactoryProvidedComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: RandomService,
      useFactory: () => new RandomService()
    }
  ]
})
export class FactoryProvidedParentComponent {

}
