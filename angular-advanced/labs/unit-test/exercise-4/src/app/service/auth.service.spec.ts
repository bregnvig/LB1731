
import { AuthService } from './auth.service';

describe('AuthService', () => {
  describe('Initially', () => {
    let service: AuthService;
  
    beforeEach(() => {
      service = new AuthService();
    });
  
    it("should be logged out", () => {
      expect(service.isLoggedIn).toBe(false);
    })

  })

  describe('When logged in', () => {
    let service: AuthService;

    beforeEach(() => {
        service = new AuthService();
        service.login('email@email.com', 'password');
    });
  
    it("should throw on login", () => {
      expect(() => service.login('anotheremail@email.com', 'password')).toThrow();
    })
  })

  describe('When not logged in', () => {
    let service: AuthService;
  
    beforeEach(() => {
      service = new AuthService();
    });
  
    it("should login with email & password", () => {
      service.login('email@email.com', 'password');
      expect(service.isLoggedIn).toBe(true);
    })

  })
  
});
