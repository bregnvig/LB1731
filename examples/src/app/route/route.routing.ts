import { RouterModule, Routes } from '@angular/router';

import { OrdersComponent, OrderComponent, RouteComponent, ConfirmGuardService, OrderResolveService } from './index';

const routes: Routes = [
    {
        path: '',
        component: RouteComponent,
        children: [
            {
                path: 'orders',
                component: OrdersComponent
            },
            {
                path: 'orders/:id',
                component: OrderComponent,
                // resolve: {
                //     orderId: OrderResolveService
                // },
                // canDeactivate: [ConfirmGuardService]
            }
        ]
    }
];

export const routeProviders = [
    ConfirmGuardService,
    OrderResolveService
]

export const routeRouting = RouterModule.forChild(routes);