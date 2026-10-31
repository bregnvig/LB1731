import { Routes } from '@angular/router';
import { CdTreeComponent } from './change-detection/cd-tree.component';
import { DeferBoardComponent } from './defer/defer-board.component';
import { ImagesComponent } from './images/images.component';
import { LeaksComponent } from './leaks/leaks.component';
import { PerformanceComponent } from './performance.component';

export const PerformanceRoutes: Routes = [
  {
    path: '',
    component: PerformanceComponent,
    children: [
      { path: 'change-detection', component: CdTreeComponent },
      { path: 'defer', component: DeferBoardComponent },
      { path: 'leaks', component: LeaksComponent },
      { path: 'images', component: ImagesComponent },
      { path: '**', redirectTo: 'change-detection' },
    ]
  }
];
