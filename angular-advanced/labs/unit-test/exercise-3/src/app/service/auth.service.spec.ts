
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it("should login with email & password", () => {
    service.login('email@email.com', 'password');
    expect(service.isLoggedIn).toBe(true);
  })

  it("should be logged out initially", () => {
    expect(service.isLoggedIn).toBe(false);
  })
  
});
