import { Routes } from "@angular/router";
import { PlaygroundsEqualityComponent } from "./equality/playgrounds-equality.component";
import { InfiniteLoopComponent } from "./infinite-loop/infinite-loop.component";
import { InputsComponent } from "./inputs/inputs.component";
import { LocationComponent } from "./location/location.component";
import { ModelComponent } from "./model/model.component";
import { PlaygroundsComponent } from "./playgrounds/playgrounds.component";
import { SignalsComponent } from "./signals.component";
import { PlaygroundsUntrackedComponent } from "./untracked";

export const SignalsRoutes: Routes = [
  {
    path: '',
    component: SignalsComponent,
    children: [
      {
        path: 'playgrounds',
        component: PlaygroundsComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
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
        path: 'model',
        component: ModelComponent,
      },
      {
        path: 'infinite-loop',
        component: InfiniteLoopComponent,
      },
      {
        path: '**',
        redirectTo: 'equality'
      }
    ]
  }
];