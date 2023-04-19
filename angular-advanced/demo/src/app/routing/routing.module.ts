import { CommonModule } from '@angular/common';
import { NgModule, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs';
import { PlaygroundService } from '../shared';
import { SharedModule } from '../shared/shared.module';
import { GuardComponent } from './guard/guard.component';
import { MissingPlaygroundComponent } from './guard/missing-playground/missing-playground.component';
import { PlaygroundGuardService } from './guard/playground-guard.service';
import { MatrixParamsComponent, QueryParamsComponent } from './params';
import { PlaygroundDetailsComponent } from './params/playground-details/playground-details.component';
import { RecapComponent } from './recap/recap.component';
import { PlaygroundResolverService } from './resolver/playground-resolver.service';
import { ResolverComponent } from './resolver/resolver.component';
import { RoutingComponent } from './routing.component';

@NgModule({
  declarations: [RoutingComponent, MatrixParamsComponent, QueryParamsComponent, RecapComponent, PlaygroundDetailsComponent, ResolverComponent, GuardComponent, MissingPlaygroundComponent],
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
            path: 'matrix',
            component: MatrixParamsComponent,
            children: [
              {
                path: ':playgroundId',
                component: PlaygroundDetailsComponent,
              }
            ]
          },
          {
            path: 'query',
            component: QueryParamsComponent,
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
                  // (component: MissingPlaygroundComponent) => component.acceptIt.value
                ],
              },
              {
                path: ':id',
                component: ResolverComponent,
                canActivate: [
                  // PlaygroundGuardService,
                  // (route: ActivatedRouteSnapshot) => {
                  //   const router = inject(Router);
                  //   return inject(PlaygroundService).getById(route.params.id).pipe(
                  //     map(playground => !!playground || router.createUrlTree(['routing', 'guard', 'missing', { id: route.params.id }]))
                  //   );
                  // }
                ],
                resolve: {
                  playground: PlaygroundResolverService,
                  p: (route: ActivatedRouteSnapshot) => inject(PlaygroundService).getById(route.params.id).pipe(first()),
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
