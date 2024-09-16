import { AuthService } from './auth.service';

describe('AuthService', () => {
  describe('Initially', () => {
    let service: AuthService;
  
    beforeEach(() => {
      service = new AuthService();
    });
  
    it("should be logged out", () => {
      // Assert
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
      // Assert
      expect(() => service.login('anotheremail@email.com', 'password')).toThrow();
    })
  })

  describe('When not logged in', () => {
    let service: AuthService;
  
    beforeEach(() => {
      service = new AuthService();
    });
  
    it("should login with email & password", () => {
      // Arrange
      const email = 'email@email.com';
      const password = 'password';
      // Act
      service.login(email, password);
      // Assert
      expect(service.isLoggedIn).toBe(true);
    })

  })

});