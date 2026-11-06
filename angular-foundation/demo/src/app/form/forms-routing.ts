import { Routes } from '@angular/router';

import { SearchFormComponent, SignalFormComponent, TemplateDriverFormComponent, TypedFormComponent } from './';

const routes: Routes = [
  {
    path: 'template-driven',
    component: TemplateDriverFormComponent
  },
  {
    path: 'model-driven',
    component: TypedFormComponent,
  },
  {
    path: 'signal',
    component: SignalFormComponent,
  },
  {
    path: 'search',
    component: SearchFormComponent
  }
];

export const FormsRouting = routes;
