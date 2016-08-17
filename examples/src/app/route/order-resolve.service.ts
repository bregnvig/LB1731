import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class OrderResolveService implements Resolve<number> {

  constructor(private router: Router) {}

  public resolve(route: ActivatedRouteSnapshot): any {

    if (route.params['id'] <= 3) {
      return +route.params['id'];
    }
    this.router.navigate(['/route/orders']);
    return false;
  }

}
