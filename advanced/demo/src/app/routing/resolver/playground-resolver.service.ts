import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Playground, PlaygroundService } from 'src/app/shared';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundResolverService  {

  constructor(private service: PlaygroundService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Playground | undefined> {
    return this.service.getById(route.params['id']).pipe(first());
    // return interval(1000).pipe(switchMapTo(this.service.getById(route.params['id'])));
  }
}

