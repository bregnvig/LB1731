import { firstValueFrom, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {

  describe("Always", () => {
    let service: AuthService;

    beforeEach(() => {
      service = new AuthService({} as any);
    });

    it("should throw when calling login with nullish email or password", () => {
      // Arrange
      const email = undefined as any as string
      const password = undefined as any as string
      // Assert
      expect(() => service.login(email, password)).toThrow('email and password must be non-nullish strings');
    });

    it("should throw when calling login with empty string email or password", () => {
      // Arrange
      const email = '';
      const password = '';
      // Assert
      expect(() => service.login(email, password)).toThrow('email and password must be truthy strings');
    });

  });

  describe("Initially", () => {
    let service: AuthService;

    beforeEach(() => {
      service = new AuthService({} as any); // Dummy
    });

    it("should not be logged in", () => new Promise<void>((resolve, reject) => {
      // Assert
      service.isLoggedIn$.pipe(first()).subscribe({
        next: isLoggedIn => {
          expect(isLoggedIn).toEqual(false);
          resolve();
        },
        error: error => reject(error),

      });
    }));

  });

  describe("When logged in", () => {
    let service: AuthService;

    beforeEach(async () => {
      const httpClientMock = { post: vi.fn().mockReturnValue(of({ authenticated: true })) };
      service = new AuthService(httpClientMock as any);
      await firstValueFrom(service.login('email@email.com', 'password').pipe(first()));
    });

    it("should throw on login", () => new Promise<void>((resolve, reject) => {
      // Arrange
      const email = 'email@email.com';
      const password = 'password';
      const login$ = service.login(email, password);
      // Act
      login$.subscribe({
        next: isLoggedIn => reject(`Received unexpected next: ${isLoggedIn}`),
        error: error => {
          // Assert
          expect(error).toEqual('Already logged in');
          resolve();
        },
      });
    }));

  });

  describe("When not logged in", () => {
    let service: AuthService;
    let httpClientMock: any;

    beforeEach(() => {
      httpClientMock = { post: vi.fn().mockReturnValue(of({ authenticated: true })) };
      service = new AuthService(httpClientMock as any);
    });

    it("should login with email & password", () => new Promise<void>((resolve, reject) => {
      // Arrange
      const email = 'email@email.com';
      const password = 'password';
      const login$ = service.login(email, password);
      // Act
      login$.subscribe({
        next: isLoggedIn => {
          // Assert
          expect(isLoggedIn).toEqual(true);
          resolve();
        },
        error: error => reject(error),
      });
    }));

    it("should call '/api/login'", () => new Promise<void>((resolve, reject) => {
      // Arrange
      const email = 'email@email.com';
      const password = 'password';
      const login$ = service.login(email, password);
      // Act
      login$.subscribe({
        next: () => {
          expect(httpClientMock.post).toHaveBeenCalledWith('/api/login', { email, password });
          resolve();
        },
        error: error => reject(error),
      });
    }));

  });

});