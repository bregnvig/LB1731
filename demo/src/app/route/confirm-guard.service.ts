import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


import { OrderComponent } from './order';

@Injectable()
export class ConfirmGuardService  {

  canDeactivate(component: OrderComponent, route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean {
    return window.confirm('Leave this page?');
  }
}
