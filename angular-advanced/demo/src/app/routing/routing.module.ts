import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { GuardComponent } from './guard/guard.component';
import { MissingPlaygroundComponent } from './guard/missing-playground/missing-playground.component';
import { PlaygroundGuardService } from './guard/playground-guard.service';
import { ParamsComponent } from './params/params.component';
import { PlaygroundDetailsComponent } from './params/playground-details/playground-details.component';
import { RecapComponent } from './recap/recap.component';
import { PlaygroundResolverService } from './resolver/playground-resolver.service';
import { ResolverComponent } from './resolver/resolver.component';
import { RoutingComponent } from './routing.component';

@NgModule({
  declarations: [RoutingComponent, ParamsComponent, RecapComponent, PlaygroundDetailsComponent, ResolverComponent, GuardComponent, MissingPlaygroundComponent],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoutingComponent,
        children: [
          {
            path: 'recap/:transform',
            component: RecapComponent,
          },
          {
            path: 'params',
            component: ParamsComponent,
            children: [
              {
                path: ':playgroundId',
                component: PlaygroundDetailsComponent,
              }
            ]
          },
          {
            path: 'resolve/:id',
            component: ResolverComponent,
            resolve: {
              playground: PlaygroundResolverService
            }
          },
          {
            path: 'guard',
            component: GuardComponent,
            children: [
              {
                path: 'missing',
                component: MissingPlaygroundComponent,
                canDeactivate: [
                  PlaygroundGuardService,
                ],
              },
              {
                path: ':id',
                component: ResolverComponent,
                canActivate: [
                  PlaygroundGuardService,
                ],
                resolve: {
                  playground: PlaygroundResolverService
                }
              },
            ]
          },
          {
            path: '**',
            redirectTo: 'recap/monospace'
          },
        ]
      }
    ])
  ]
})
export class RoutingModule { }
