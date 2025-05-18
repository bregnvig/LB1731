import { Routes } from "@angular/router";
import { GlobalStateComponent } from "./global-state.component";
import { LocalStateComponent } from "./local-state.component";
import { GlobalStateListenerService, StateListenerService } from "./state-listener/state-listener.service";
import { StateManagementComponent } from "./state-management.component";
import { UrlStateChildRouteComponent, UrlStateComponent } from "./url-state.component";
import { FormStateComponent } from "./form-state.component";

export const StateManagementRoutes: Routes = [
  {
    path: '',
    component: StateManagementComponent,
    providers: [
      {
        provide: StateListenerService,
        useClass: GlobalStateListenerService,
      }
    ],
    children: [
      {
        path: '',
        redirectTo: 'global',
        pathMatch: 'full'
      },
      {
        path: 'global',
        component: GlobalStateComponent,
      },
      {
        path: 'local',
        component: LocalStateComponent,
      },
      {
        path: 'url',
        component: UrlStateComponent,
        children: [
          {
            path: '',
            redirectTo: 'child-route/123',
            pathMatch: 'full'
          },
          {
            path: 'child-route/:id',
            component: UrlStateChildRouteComponent,
          }
        ]
      },
      {
        path: 'form',
        component: FormStateComponent,
      },
      // {
      //   path: 'store',
      //   component: StoreComponent,
      // },
      // {
      //   path: 'service-and-store',  // service & store relationship slide 15
      //   component: ServiceAndStoreComponent,
      // },
      // {
      //   path: 'store-with-signals',  // store with signals slide 19
      //   component: ServiceAndStoreComponent,
      // },
      // {
      //   path: 'store-with-rxresource', // store with rxresource slide 30
      //   component: RxResourceComponent,
      // }
    ]
  }
]