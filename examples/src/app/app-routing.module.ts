import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';

import { MenuComponent } from './menu';
const routes: Routes = [
    {
        path: 'menu',
        component: MenuComponent
    },
    {
        path: 'components',
        loadChildren: 'app/components/components.module#ComponentsModule'
    },
    {
        path: 'io',
        loadChildren: 'app/io/io.module#IOModule'
    },
    {
        path: 'services',
        loadChildren: 'app/services/services.module#ServicesModule'
    },
    {
        path: 'async',
        loadChildren: 'app/async/async.module#AsyncModule'
    },
    {
        path: 'pipes',
        loadChildren: 'app/pipes/pipes.module#PipesModule'
    },
    {
        path: 'orders',
        loadChildren: 'app/route/route.module#RouteModule'
    },
    {
        path: 'form',
        loadChildren: 'app/form/form.module#FormModule'
    },
    {
        path: '**',
        redirectTo: 'menu',
        pathMatch: 'full'
    }
];

export const routing = RouterModule.forRoot(routes);
