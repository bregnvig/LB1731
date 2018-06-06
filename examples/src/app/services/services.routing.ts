import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  } from './index';
import { NonProvidedComponent } from 'app/services/non-provided/non-provided.component';
import { ProvidedComponent } from 'app/services/provided/provided.component';
import { FactoryProvidedComponent } from 'app/services/factory-provided/factory-provided.component';
import { ProvidedParentComponent } from 'app/services/provided-parent/provided-parent.component';
import { FactoryProvidedParentComponent } from 'app/services/factory-provided-parent/factory-provided-parent.component';

const routes: Routes = [
    {
        path: 'no-provider',
        component: NonProvidedComponent
    },
    {
        path: 'provided',
        component: ProvidedParentComponent
    },
    {
        path: 'factory',
        component: FactoryProvidedParentComponent
    }
]

export const servicesRouting = RouterModule.forChild(routes);
