import { Routes } from "@angular/router";
import { LocationWithRxjsComponent, LocationWithSignalsComponent } from "./location";
import { PlaygroundsWithRxjsComponent, PlaygroundsWithSignalsComponent } from "./playgrounds";
import { SignalsComponent } from "./signals.component";
import { PlaygroundsEqualityComponent } from "./equality/playgrounds-equality.component";
import { PlaygroundsUntrackedComponent } from "./untracked";
import { InputsComponent } from "./inputs/inputs.component";

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
        path: 'equality',
        component: PlaygroundsEqualityComponent
      },
      {
        path: 'untracked',
        component: PlaygroundsUntrackedComponent
      },
      {
        path: 'inputs',
        component: InputsComponent,
      },
      {
        path: '**',
        redirectTo: 'playgrounds-rxjs'
      }
    ]
  }
];