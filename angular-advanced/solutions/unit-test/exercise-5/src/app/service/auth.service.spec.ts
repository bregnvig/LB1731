import { firstValueFrom, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from './auth.service';

describe('AuthService', () => {

  describe("Always", () => {
    let service: AuthService;

    beforeEach(() => {
      service = new AuthService({} as any);
    });

    it("should throw when calling login with nullish email or password", () => {
      const undefinedAsString = undefined as any as string;
      expect(() => service.login(undefinedAsString, undefinedAsString)).toThrow('email and password must be non-nullish strings');
    });

    it("should throw when calling login with empty string email or password", () => {
      expect(() => service.login('', '')).toThrow('email and password must be non-empty strings');
    });

  });

  describe("Initially", () => {
    let service: AuthService;

    beforeEach(() => {
      service = new AuthService({} as any); // Dummy
    });

    it("should not be logged in", done => {
      service.isLoggedIn$.pipe(first()).subscribe({
        next: isLoggedIn => {
          expect(isLoggedIn).toEqual(false);
          done();
        },
        error: error => done(error),

      });
    });

  });

  describe("When logged in", () => {
    let service: AuthService;

    beforeEach(async () => {
      const httpClientMock = { post: jest.fn().mockReturnValue(of({ authenticated: true })) };
      service = new AuthService(httpClientMock as any);
      await firstValueFrom(service.login('email@email.com', 'password').pipe(first()));
    });

    it("should throw on login", done => {
      service.login('email@email.com', 'password').subscribe({
        next: isLoggedIn => done(`Received unexpected next: ${isLoggedIn}`),
        error: error => {
          expect(error).toEqual('Already logged in');
          done();
        },
      });
    });

  });

  describe("When not logged in", () => {
    let service: AuthService;
    let httpClientMock: any;

    beforeEach(() => {
      httpClientMock = { post: jest.fn().mockReturnValue(of({ authenticated: true })) };
      service = new AuthService(httpClientMock as any);
    });

    it("should login with email & password", (done) => {
      service.login('email@email.com', 'password').subscribe({
        next: isLoggedIn => {
          expect(isLoggedIn).toEqual(true);
          done();
        },
        error: error => done(error),
      });
    });

    it("should call '/api/login'", (done) => {
      const email = 'email@email.com';
      const password = 'password';
      service.login(email, password).subscribe({
        next: () => {
          expect(httpClientMock.post).toHaveBeenCalledWith('/api/login', { email, password });
          done();
        },
        error: error => done(error),
      });
    });

  });

});