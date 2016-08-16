import { RouterModule, Routes } from '@angular/router';

import { BindingAttributeComponent, BindingsAttributeComponent, SimpleAttributeComponent, UserEventAttributeComponent } from './index';

const routes: Routes = [
    {
        path: 'attributes/simple',
        component: SimpleAttributeComponent
    },
    {
        path: 'attributes/user-event',
        component: UserEventAttributeComponent
    },
    {
        path: 'attributes/binding',
        component: BindingAttributeComponent
    },
    {
        path: 'attributes/bindings',
        component: BindingsAttributeComponent
    }
];

export const attributesRoutes = RouterModule.forChild(routes);
