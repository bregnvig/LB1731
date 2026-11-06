import { AsyncComponent } from './async/async.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuildInComponent, ChainingComponent, PhoneComponent, PureComponent, TodayComponent } from './index';

const routes: Routes = [
  {
    path: 'today',
    component: TodayComponent
  },
  {
    path: 'buildin',
    component: BuildInComponent
  },
  {
    path: 'async',
    component: AsyncComponent
  },
  {
    path: 'chaining',
    component: ChainingComponent
  },
  {
    path: 'phone',
    component: PhoneComponent
  },
  {
    path: 'pure',
    component: PureComponent
  }
];

export const PipesRouting = routes;
