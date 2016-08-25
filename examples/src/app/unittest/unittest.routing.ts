import { RouterModule, Routes } from '@angular/router';

import { HelloWorldComponent } from './index';

const routes: Routes = [
    {
        path: 'unittest/component',
        component: HelloWorldComponent
    }
];

export const routing = RouterModule.forChild(routes);