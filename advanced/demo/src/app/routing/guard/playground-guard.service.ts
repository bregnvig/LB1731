import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlaygroundService } from 'src/app/shared';
import { MissingPlaygroundComponent } from './missing-playground/missing-playground.component';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundGuardService  {

  constructor(private router: Router, private service: PlaygroundService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.service.getById(route.params['id']).pipe(
      map(playground => !!playground || this.router.createUrlTree(['routing', 'guard', 'missing', { id: route.params['id'] }]))
    );
  }

  canDeactivate(component: MissingPlaygroundComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    return component.acceptIt.value;
  }

};