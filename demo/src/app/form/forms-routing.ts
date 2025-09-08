import { Routes } from '@angular/router';

import { SearchFormComponent, TemplateDriverFormComponent, TypedFormComponent } from './';

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
    path: 'search',
    component: SearchFormComponent
  }
];

export const FormsRouting = routes;
