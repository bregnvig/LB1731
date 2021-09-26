import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from './auth.service';

describe('AuthService', () => {

  describe("Always", () => {
    let service: AuthService;

    beforeEach(() => {
      service = new AuthService({} as any);
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
      service = new AuthService({} as any);
    });

    it("is not logged in", done => {
      service.isLoggedIn$.pipe(first()).subscribe(
        isLoggedIn => expect(isLoggedIn).toEqual(false),
        error => { throw error; },
        () => done(),
      );
    });

  });

  describe("When logged in", () => {
    let service: AuthService;
    const email = 'email@email.com';
    const password = 'password';

    beforeEach(async () => {
      const httpClientMock = { post: jest.fn().mockReturnValue(of(true)) };
      service = new AuthService(httpClientMock as any);
      await service.login(email, password).pipe(first()).toPromise();
    });

    it("throws when calling login", done => {
      service.login(email, password).subscribe(
        isLoggedIn => done(`Received unexpected next: ${isLoggedIn}`),
        error => {
          expect(error).toEqual('Already logged in');
          done();
        },
      );
    });

  });

  describe("When not logged in", () => {
    let service: AuthService;
    let httpClientMock: any;

    beforeEach(() => {
      httpClientMock = { post: jest.fn().mockReturnValue(of(true)) };
      service = new AuthService(httpClientMock as any);
    });

    it("logins with email & password", (done) => {
      const email = 'email@email.com';
      const password = 'password';
      service.login(email, password).subscribe(
        isLoggedIn => {
          expect(isLoggedIn).toEqual(true);
          done();
        },
        error => done(error),
      );
    });

    it("should call '/api/login'", (done) => {
      const email = 'email@email.com';
      const password = 'password';
      service.login(email, password).subscribe(
        () => {
          expect(httpClientMock.post).toHaveBeenCalledWith('/api/login', { email, password });
          done();
        },
        error => done(error),
      );
    });

  });

});
