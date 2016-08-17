import { Routes, RouterModule }  from '@angular/router';

import { MenuComponent } from './menu';
const routes: Routes = [
    {
        path: 'menu',
        component: MenuComponent
    },
    {
        path: '',
        redirectTo: '/menu',
        pathMatch: 'full'
    },
    {
        path: 'route',
        loadChildren: 'app/route/route.module#MyRouteModule'
    }
];

export const routing = RouterModule.forRoot(routes);