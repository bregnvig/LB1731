import { RouterModule, Routes } from '@angular/router';

import { OnewayComponent, PersonForm1Component, PersonForm2Component, PersonForm3Component, PersonForm4Component, PersonForm5Component, SearchFormComponent } from './index';
import { TypedFormComponent } from './typed-form/typed-form.component';

const routes: Routes = [
  {
    path: 'person1',
    component: PersonForm1Component
  },
  {
    path: 'oneway',
    component: OnewayComponent
  },
  {
    path: 'person2',
    component: PersonForm2Component
  },
  {
    path: 'person3',
    component: PersonForm3Component
  },
  {
    path: 'person4',
    component: PersonForm4Component
  },
  {
    path: 'person5',
    component: PersonForm5Component
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

export const routing = RouterModule.forChild(routes);
