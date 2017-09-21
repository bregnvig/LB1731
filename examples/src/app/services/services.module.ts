import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { servicesRouting } from './services.routing';
import { RandomService, RANDOM_FACTORY } from 'app/services/random.service';
import { NonProvidedComponent } from './non-provided/non-provided.component';
import { ProvidedComponent } from './provided/provided.component';
import { FactoryProvidedComponent } from './factory-provided/factory-provided.component';
import { ProvidedParentComponent } from './provided-parent/provided-parent.component';
import { FactoryProvidedParentComponent } from './factory-provided-parent/factory-provided-parent.component';

export const factoryMethod = () => () => new RandomService();

@NgModule({
    declarations: [
        NonProvidedComponent,
        ProvidedComponent,
        FactoryProvidedComponent,
        ProvidedParentComponent,
        FactoryProvidedParentComponent
    ],
    imports: [CommonModule, FormsModule, servicesRouting],
    providers: [
        RandomService,
        {
            provide: RANDOM_FACTORY,
            useFactory: factoryMethod
        }
    ]
})
export class ServicesModule {

}
