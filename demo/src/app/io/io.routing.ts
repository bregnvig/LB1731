import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DirectlyComponent, IOEventComponent, InterceptComponent, LocalComponent, StopwatchComponent, ViewchildComponent, ViewChildrenComponent } from './index';

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
    path: 'local',
    component: LocalComponent
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
