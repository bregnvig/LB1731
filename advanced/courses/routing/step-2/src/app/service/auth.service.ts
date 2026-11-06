import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly email$ = new BehaviorSubject<string | null>(sessionStorage.getItem('email'));
  isLoggedIn$: Observable<boolean> = this.email$.asObservable().pipe(map(email => !!email), shareReplay({ refCount: false, bufferSize: 1 }));

  login(email: string, password: string): Observable<boolean> {
    sessionStorage.setItem('email', email);
    this.email$.next(email);
    return this.isLoggedIn$.pipe(first());
  }

}
