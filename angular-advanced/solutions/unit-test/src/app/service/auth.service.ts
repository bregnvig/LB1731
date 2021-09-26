import { Injectable } from '@angular/core';

const isNullOrUndefined = (value: any): value is null | undefined => value === null || value === undefined;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = false;

  constructor() { }

  login(email: string, password: string): void {

    if (this.isLoggedIn) {
      throw new Error('Already logged in');
    }
    if ([email, password].some(isNullOrUndefined)) {
      throw new Error('email and password must be non-nullish strings');
    }
    if ([email, password].some(value => value === '')) {
      throw new Error('email and password must be non-empty strings');
    }
    this.isLoggedIn = true;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  
  private set isLoggedIn(isLoggedIn: boolean) {
    this._isLoggedIn = isLoggedIn;
  }

}
