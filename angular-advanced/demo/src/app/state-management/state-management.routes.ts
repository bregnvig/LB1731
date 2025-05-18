import { Routes } from "@angular/router";
import { StateManagementComponent } from "./state-management.component";
import { GlobalStateComponent } from "./global-state.component";

export const StateManagementRoutes: Routes = [
  {
    path: '',
    component: StateManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'global-state',
        pathMatch: 'full'
      },
      {
        path: 'global-state',
        component: GlobalStateComponent,
      },
      // {
      //   path: 'local-state',
      //   component: LocalStateComponent,
      // },
      // {
      //  path: 'store',
      //   component: StoreComponent,
      // },
      // {
      //   path: 'url',
      //   component: UrlComponent,
      // },
      // {
      //   path: 'forms',
      //   component: FormsComponent,
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