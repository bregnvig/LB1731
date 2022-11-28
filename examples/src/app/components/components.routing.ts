import { RouterModule, Routes } from '@angular/router';

import { EventComponent, HelloComponent, InterpolationComponent, NgforComponent, NgifComponent, OuterComponent, PropertyComponent, TwowayComponent } from './index';

const routes: Routes = [
  {
    path: 'hello',
    component: HelloComponent
  },
  {
    path: 'outer',
    component: OuterComponent
  },
  {
    path: 'interpolation',
    component: InterpolationComponent
  },
  {
    path: 'property',
    component: PropertyComponent
  },
  {
    path: 'event',
    component: EventComponent
  },
  {
    path: 'twoway',
    component: TwowayComponent
  },
  {
    path: 'ng-if',
    component: NgifComponent
  },
  {
    path: 'ng-for',
    component: NgforComponent
  }
];

export const componentsRouting = RouterModule.forChild(routes);
