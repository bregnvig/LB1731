import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrdersComponent, OrderComponent, RouteComponent, ConfirmGuardService, OrderResolveService } from './index';

const routes: Routes = [
    {
        path: '',
        component: RouteComponent,
        children: [
            {
                path: '',
                component: OrdersComponent,
            },
            {
                path: ':id',
                component: OrderComponent
            }
        ]
    }
];

export const routeRouting = RouterModule.forChild(routes);