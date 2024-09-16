import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;

  login(email: string, password: string) {
    this.isLoggedIn = true;
  }
}
