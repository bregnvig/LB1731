import { RouterModule, Routes } from '@angular/router';

import { PersonForm1Component, PersonForm2Component, PersonForm3Component, PersonForm4Component, PersonForm5Component, PersonForm6Component, PersonForm7Component, SearchFormComponent } from './index';

const routes: Routes = [
    {
        path: 'form/person1',
        component: PersonForm1Component
    },
    {
        path: 'form/person2',
        component: PersonForm2Component
    },
    {
        path: 'form/person3',
        component: PersonForm3Component
    },
    {
        path: 'form/person4',
        component: PersonForm4Component
    },
    {
        path: 'form/person5',
        component: PersonForm5Component
    },
    {
        path: 'form/person6',
        component: PersonForm6Component
    },
    {
        path: 'form/person7',
        component: PersonForm7Component
    },
    {
        path: 'form/search',
        component: SearchFormComponent
    }
]

export const routing = RouterModule.forChild(routes);