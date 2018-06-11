import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonForm1Component, PersonForm2Component, PersonForm3Component, PersonForm4Component, PersonForm5Component, PersonForm6Component, PersonForm7Component, SearchFormComponent, OnewayComponent } from './index';

const routes: Routes = [
    {
        path: 'person1',
        component: PersonForm1Component
    },
    {
        path: 'oneway',
        component: OnewayComponent
    },
    {
        path: 'person2',
        component: PersonForm2Component
    },
    {
        path: 'person3',
        component: PersonForm3Component
    },
    {
        path: 'person4',
        component: PersonForm4Component
    },
    {
        path: 'person5',
        component: PersonForm5Component
    },
    {
        path: 'person6',
        component: PersonForm6Component
    },
    {
        path: 'person7',
        component: PersonForm7Component
    },
    {
        path: 'search',
        component: SearchFormComponent
    }
]

export const routing = RouterModule.forChild(routes);
