import { MapComponent } from './map/map.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: MapComponent
    },
    {
        path: ':id',
        component: MapComponent
    }
];

export const routing = RouterModule.forRoot(routes);

