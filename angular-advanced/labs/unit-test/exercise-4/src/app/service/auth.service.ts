import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;

  constructor() { }

  login(email: string, password: string) {
    if(this.isLoggedIn) {
      throw new Error('Already logged in');
    }
    this.isLoggedIn = true;
  }
}
