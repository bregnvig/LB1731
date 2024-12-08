import { Injectable } from '@angular/core';
import { isNullOrUndefined } from '../utils/object-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;


  login(email: string, password: string) {
    if(this.isLoggedIn) {
      throw new Error('Already logged in');
    }
    
    if ([email, password].some(isNullOrUndefined)) {
      throw 'email and password must be non-nullish strings';
    }
    if ([email, password].some(value => value === '')) {
      throw 'email and password must be truthy strings';
    }
    
    this.isLoggedIn = true;
  }

}
