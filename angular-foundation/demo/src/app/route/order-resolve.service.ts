import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class OrderResolveService  {

  #router = inject(Router);

   resolve(route: ActivatedRouteSnapshot): any {

    if (route.params['id'] <= 3) {
      return +route.params['id'];
    }
    this.#router.navigate(['/route/orders']);
    return false;
  }

}
