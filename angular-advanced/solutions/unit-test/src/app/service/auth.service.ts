import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map, shareReplay, switchMap } from 'rxjs/operators';

const isNullOrUndefined = (value: any): value is null | undefined => value === null || value === undefined;
type AuthUser = {authenticated: boolean};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> =  this._isLoggedIn$.asObservable().pipe(shareReplay({refCount: false, bufferSize: 1}));

  constructor(private httpClient: HttpClient) {
  }

  login(email: string, password: string): Observable<boolean> {
    if ([email, password].some(isNullOrUndefined)) {
      throw 'email and password must be non-nullish strings';
    }
    if ([email, password].some(value => value === '')) {
      throw 'email and password must be non-empty strings';
    }

    return this.isLoggedIn$.pipe(
      first(),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          throw 'Already logged in';
        }
        return this.httpClient.post<AuthUser>(`/api/login`, { email, password }).pipe(
          map(authUser => {
            this._isLoggedIn$.next(authUser.authenticated);
            return !!authUser?.authenticated;
          })
        );
      }),
    );
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }

}
