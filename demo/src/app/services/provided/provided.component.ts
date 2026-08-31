import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RandomService } from './../random.service';

@Component({
  selector: 'app-provided',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '{{service.random}}',
})
export class ProvidedComponent {

  protected service = inject(RandomService);
}
