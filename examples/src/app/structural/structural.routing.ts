import { RouterModule, Routes } from '@angular/router';

import { CaseStudyComponent, UnlessComponent } from './index';

const routes: Routes = [
    {
        path: 'structural/case-study',
        component: CaseStudyComponent
    },
    {
        path: 'structural/unless',
        component: UnlessComponent
    }
]

export const structuralRoutes = RouterModule.forChild(routes);
