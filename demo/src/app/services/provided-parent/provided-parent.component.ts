import { Component } from '@angular/core';
import { ProvidedComponent } from '../provided/provided.component';
import { RandomService } from '../random.service';

@Component({
  selector: 'app-provided-parent',
  template: `
    <h2>Provided</h2>
    <p><app-provided/></p>
    <p><app-provided/></p>
    <p><app-provided/></p>
  `,
  imports: [ProvidedComponent],
  providers: [RandomService]
})
export class ProvidedParentComponent {

}
