import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { routeRouting, routeProviders } from './route.routing';

@NgModule({
    imports: [CommonModule, routeRouting],
    providers: [...routeProviders]
})
export class MyRouteModule { }