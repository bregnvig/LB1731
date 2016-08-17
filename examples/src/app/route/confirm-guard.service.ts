import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


import { OrderComponent } from './order';

@Injectable()
export class ConfirmGuardService implements CanDeactivate<OrderComponent> {

  canDeactivate(component: OrderComponent, route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean {
    return window.confirm('Leave this page?');
  }
}
