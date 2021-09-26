import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

const isNullOrUndefined = (value: any): value is null | undefined => value === null || value === undefined;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _isLoggedIn$ = new BehaviorSubject<boolean>(false);

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
        return this.httpClient.post<boolean>(`/api/login`, { email, password }).pipe(
          tap(isLoggedIn => this._isLoggedIn$.next(isLoggedIn))
        );
      }),
    );
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$.asObservable();
  }

}
