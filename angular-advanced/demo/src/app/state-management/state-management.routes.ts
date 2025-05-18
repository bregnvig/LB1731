import { Routes } from "@angular/router";
import { GlobalStateComponent } from "./feature/global-state.component";
import { LocalStateComponent } from "./feature/local-state.component";
import { GlobalStateListenerService, StateListenerService } from "./shared/state-listener/state-listener.service";
import { StateManagementComponent } from "./state-management.component";
import { UrlStateChildRouteComponent, UrlStateComponent } from "./feature/url-state.component";
import { FormStateComponent } from "./feature/form-state.component";

export const StateManagementRoutes: Routes = [
  {
    path: '',
    component: StateManagementComponent,
    providers: [
      {
        provide: StateListenerService,
        useClass: GlobalStateListenerService, // Technically, this is not a global state. But for the sake of this example we call it global state.
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