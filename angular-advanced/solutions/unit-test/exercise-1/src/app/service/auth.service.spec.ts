import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it("should login with email & password", () => {
    service.login('email@email.com', 'password');
    expect(service.isLoggedIn).toBe(true);
  })

  it("should not be logged in initially", () => {
    expect(service.isLoggedIn).toBe(false);
  })
  
});
