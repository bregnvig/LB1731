import { firstValueFrom, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { vi } from 'vitest';
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

    it("should not be logged in", async () => {
      // Assert
      const isLoggedIn = await firstValueFrom(service.isLoggedIn$.pipe(first()));
      expect(isLoggedIn).toEqual(false);
    });

  });

  describe("When logged in", () => {
    let service: AuthService;

    beforeEach(async () => {
      const httpClientMock = { post: vi.fn().mockReturnValue(of({ authenticated: true })) };
      service = new AuthService(httpClientMock as any);
      await firstValueFrom(service.login('email@email.com', 'password').pipe(first()));
    });

    it("should throw on login", async () => {
      // Arrange
      const email = 'email@email.com';
      const password = 'password';

      // Act & Assert
      await expect(firstValueFrom(service.login(email, password))).rejects.toEqual('Already logged in');
    });

  });

  describe("When not logged in", () => {
    let service: AuthService;
    let httpClientMock: any;

    beforeEach(() => {
      httpClientMock = { post: vi.fn().mockReturnValue(of({ authenticated: true })) };
      service = new AuthService(httpClientMock as any);
    });

    it("should login with email & password", async () => {
      // Arrange
      const email = 'email@email.com';
      const password = 'password';

      // Act
      const isLoggedIn = await firstValueFrom(service.login(email, password));

      // Assert
      expect(isLoggedIn).toEqual(true);
    });

    it("should call '/api/login'", async () => {
      // Arrange
      const email = 'email@email.com';
      const password = 'password';

      // Act
      await firstValueFrom(service.login(email, password));

      // Assert
      expect(httpClientMock.post).toHaveBeenCalledWith('/api/login', { email, password });
    });

  });

});