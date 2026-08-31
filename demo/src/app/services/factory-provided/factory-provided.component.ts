import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RandomService } from '../random.service';

@Component({
  selector: 'app-factory-provided',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '{{service.random}}',
})
export class FactoryProvidedComponent {

  protected service = inject(RandomService);

}
