import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrdersComponent, OrderComponent, RouteComponent, ConfirmGuardService, OrderResolveService } from './index';

const routes: Routes = [
    {
        path: 'route',
        component: RouteComponent,
        children: [
            {
                path: 'orders',
                component: OrdersComponent,
            },
            {
                path: 'orders/:id',
                component: OrderComponent
            }
        ]
    }
];

export const routeRouting = RouterModule.forChild(routes);