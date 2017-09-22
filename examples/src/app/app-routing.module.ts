import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';

import { MenuComponent } from './menu';
const routes: Routes = [
    {
        path: 'menu',
        component: MenuComponent
    },
    {
        path: 'orders',
        loadChildren: 'app/route/route.module#RouteModule'
    },
    {
        path: '**',
        redirectTo: 'menu',
        pathMatch: 'full'
    }
];

export const routing = RouterModule.forRoot(routes);
