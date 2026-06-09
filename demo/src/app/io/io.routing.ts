import { Routes } from '@angular/router';

import { DirectlyComponent, InterceptComponent, IOEventComponent, ReferenceComponent, ViewchildComponent, ViewChildrenComponent } from './index';

const routes: Routes = [
  {
    path: 'directly',
    component: DirectlyComponent
  },
  {
    path: 'intercept',
    component: InterceptComponent
  },
  {
    path: 'event',
    component: IOEventComponent
  },
  {
    path: 'reference',
    component: ReferenceComponent
  },
  {
    path: 'viewchild',
    component: ViewchildComponent
  },
  {
    path: 'viewchildren',
    component: ViewChildrenComponent
  }
];

export const IORouting = routes;
