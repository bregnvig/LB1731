import { AuthService } from './auth.service';

describe('AuthService', () => {
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
    expect(service.isLoggedIn).toEqual(true);
  })

  it("should not be logged in initially", () => {
    // Assert
    expect(service.isLoggedIn).toBe(false);
  })

});