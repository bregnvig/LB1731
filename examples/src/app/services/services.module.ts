import { LoggerService } from './logger.service';
import { RandomLoggerService, RandomService, RANDOM_FACTORY, factoryMethod } from './random.service';
import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { servicesRouting } from './services.routing';
import { NonProvidedComponent } from './non-provided/non-provided.component';
import { ProvidedComponent } from './provided/provided.component';
import { FactoryProvidedComponent } from './factory-provided/factory-provided.component';
import { ProvidedParentComponent } from './provided-parent/provided-parent.component';
import { FactoryProvidedParentComponent } from './factory-provided-parent/factory-provided-parent.component';

@NgModule({
    imports: [CommonModule, FormsModule, servicesRouting, NonProvidedComponent,
        ProvidedComponent,
        FactoryProvidedComponent,
        ProvidedParentComponent,
        FactoryProvidedParentComponent],
    providers: [
        LoggerService,
        {
            provide: RandomService,
            useClass: RandomService
        },
        {
            provide: RANDOM_FACTORY,
            useFactory: factoryMethod
        }
    ]
})
export class ServicesModule {

}
