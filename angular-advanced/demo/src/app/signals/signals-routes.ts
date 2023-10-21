import { Routes } from "@angular/router";
import { LocationWithRxjsComponent, LocationWithSignalsComponent } from "./location";
import { PlaygroundsWithRxjsComponent, PlaygroundsWithSignalsComponent } from "./playgrounds";
import { SignalsComponent } from "./signals.component";

export const SignalsRoutes: Routes = [
  {
    path: '',
    component: SignalsComponent,
    children: [
      {
        path: 'playgrounds-rxjs',
        component: PlaygroundsWithRxjsComponent
      },
      {
        path: 'playgrounds-signals',
        component: PlaygroundsWithSignalsComponent
      },
      {
        path: 'location-rxjs',
        component: LocationWithRxjsComponent
      },
      {
        path: 'location-signals',
        component: LocationWithSignalsComponent
      },
      {
        path: '**',
        redirectTo: 'playgrounds-rxjs'
      }
    ]
  }
];