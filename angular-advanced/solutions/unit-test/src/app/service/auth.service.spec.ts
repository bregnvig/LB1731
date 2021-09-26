import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {

  describe("Always", () => {
    let service: AuthService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(AuthService);
    });

    it("throws when calling login with nullish email or password", () => {
      const undefinedAsString = undefined as any as string;
      expect(() => service.login(undefinedAsString, undefinedAsString)).toThrow('email and password must be non-nullish strings');
    });

    it("throws when calling login with empty string email or password", () => {
      expect(() => service.login('', '')).toThrow('email and password must be non-empty strings');
    });

  });

  describe("Initially", () => {
    let service: AuthService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(AuthService);
    });

    it("is not logged in", () => {
      expect(service.isLoggedIn).toEqual(false);
    });

  });

  describe("When logged in", () => {
    let service: AuthService;
    const email = 'email@email.com';
    const password = 'password';

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(AuthService);
      service.login(email, password);
    });

    it("throws when calling login", () => {
      expect(() => service.login(email, password)).toThrow("Already logged in");
    });

  });

  describe("When not logged in", () => {
    let service: AuthService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
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
