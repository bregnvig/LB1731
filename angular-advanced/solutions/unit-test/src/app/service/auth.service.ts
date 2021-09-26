import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;

  constructor() { }

  login(email: string, password: string): void {
    this.isLoggedIn = true;
  }

}
