import { Component, inject } from '@angular/core';
import { RandomService } from '../random.service';

@Component({
  selector: 'app-factory-provided',
  template: '{{service.random}}',
})
export class FactoryProvidedComponent {

  service = inject(RandomService);

}
