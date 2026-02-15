import { Component } from '@angular/core';
import { FactoryProvidedComponent } from '../factory-provided/factory-provided.component';
import { RandomService } from '../random.service';

@Component({
  selector: 'app-factory-provided-parent',
  templateUrl: './factory-provided-parent.component.html',
  imports: [FactoryProvidedComponent],
  providers: [
    {
      provide: RandomService,
      useFactory: () => new RandomService()
    }
  ]
})
export class FactoryProvidedParentComponent {

}
