import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {

  describe("Initially", () => {
    let service: AuthService;

    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it("is not logged in", () => {
      expect(service.isLoggedIn).toEqual(false);
    });

  });

  describe("When logged in", () => {
    let service: AuthService;

    beforeEach(() => {
      service = TestBed.inject(AuthService);
      service.isLoggedIn = true;
    });

    it("should throw when calling login", () => {
      const email = 'email@email.com';
      const password = 'password';
      expect(() => service.login(email, password)).toThrow("Already logged in");
    });

  });

  describe("When not logged in", () => {
    let service: AuthService;

    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it("logins with email & password", () => {
      const email = 'email@email.com';
      const password = 'password';
      service.login(email, password);
      expect(service.isLoggedIn).toEqual(true);
    });

  });

});
