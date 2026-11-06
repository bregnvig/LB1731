import { RouterModule, Routes } from '@angular/router';
import { NonProvidedComponent } from './non-provided/non-provided.component';
import { ProvidedParentComponent } from './provided-parent/provided-parent.component';
import { FactoryProvidedParentComponent } from './factory-provided-parent/factory-provided-parent.component';


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
];

export const ServicesRouting = routes;
