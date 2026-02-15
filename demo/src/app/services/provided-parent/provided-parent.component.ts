import { Component } from '@angular/core';
import { ProvidedComponent } from '../provided/provided.component';
import { RandomService } from '../random.service';

@Component({
  selector: 'app-provided-parent',
  templateUrl: './provided-parent.component.html',
  imports: [ProvidedComponent],
  providers: [RandomService]
})
export class ProvidedParentComponent {

}
