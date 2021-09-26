import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = TestBed.inject(AuthService);
  });

  it("logins with email & password", () => {
    const email = 'email@email.com';
    const password = 'password';
    service.login(email, password);
    expect(service.isLoggedIn).toEqual(true);
  })

  it("is not logged in initially", () => {
    expect(service.isLoggedIn).toEqual(false);
  })

});
