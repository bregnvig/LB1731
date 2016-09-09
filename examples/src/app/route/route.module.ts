import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { routeRouting } from './route.routing';
import { RouteComponent, OrderComponent, OrdersComponent } from './index';


@NgModule({
    declarations: [RouteComponent, OrderComponent, OrdersComponent],
    imports: [CommonModule, routeRouting]
})
export class MyRouteModule { }