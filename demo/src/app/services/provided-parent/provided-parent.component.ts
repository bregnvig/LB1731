import { Component } from '@angular/core';
import { ProvidedComponent } from '../provided/provided.component';

@Component({
    selector: 'app-provided-parent',
    templateUrl: './provided-parent.component.html',
    standalone: true,
    imports: [ProvidedComponent],
})
export class ProvidedParentComponent {

}
