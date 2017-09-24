import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routeRouting } from './route-routing.module';

import { OrderComponent, OrdersComponent } from './index';


@NgModule({
    declarations: [OrderComponent, OrdersComponent],
    imports: [CommonModule, routeRouting]
})
export class RouteModule { }
