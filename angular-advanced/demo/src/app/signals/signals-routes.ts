import { Routes } from "@angular/router";
import { SignalsWithRxjsComponent } from "./rxjs/signals-with-rxjs.component";
import { SignalsComponent } from "./signals.component";
import { SignalsWithSignalsComponent } from "./signals/signals-with-signals.component";

export const SignalsRoutes: Routes = [
  {
    path: '',
    component: SignalsComponent,
    children: [
      {
        path: 'with-rxjs',
        component: SignalsWithRxjsComponent
      },
      {
        path: 'with-signals',
        component: SignalsWithSignalsComponent
      },
      {
        path: '**',
        redirectTo: 'with-rxjs'
      }
    ]
  }
];