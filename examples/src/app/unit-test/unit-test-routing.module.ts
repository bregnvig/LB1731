import { HelloWorldComponent } from './../unit-test/hello-world/hello-world.component';
import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'unit-test/hello-world',
        component: HelloWorldComponent
    }
];

export const routing = RouterModule.forChild(routes);
