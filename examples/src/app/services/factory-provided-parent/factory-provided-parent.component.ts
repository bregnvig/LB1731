import { Component } from '@angular/core';
import { FactoryProvidedComponent } from '../factory-provided/factory-provided.component';

@Component({
    selector: 'app-factory-provided-parent',
    templateUrl: './factory-provided-parent.component.html',
    standalone: true,
    imports: [FactoryProvidedComponent],
})
export class FactoryProvidedParentComponent {

}
