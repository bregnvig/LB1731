import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuildInComponent, ChainingComponent, PhoneComponent, PureComponent, TodayComponent } from './index';

const routes: Routes = [
    {
        path: 'pipes/today',
        component: TodayComponent
    },
    {
        path: 'pipes/buildin',
        component: BuildInComponent
    },
    {
        path: 'pipes/chaining',
        component: ChainingComponent
    },
    {
        path: 'pipes/phone',
        component: PhoneComponent
    },
    {
        path: 'pipes/pure',
        component: PureComponent
    }
]

export const routing = RouterModule.forChild(routes);
