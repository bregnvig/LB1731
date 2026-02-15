import { Component, inject } from '@angular/core';
import { RandomService } from './../random.service';

@Component({
  selector: 'app-provided',
  template: '{{service.random}}',
})
export class ProvidedComponent {

  service = inject(RandomService);
}
