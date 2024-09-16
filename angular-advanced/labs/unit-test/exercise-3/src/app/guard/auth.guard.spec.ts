import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { authGuard } from './auth.guard';

/**
 * Test suite below is skipped out because of missing AuthService to begin with. 
 * When AuthService is created and isLoggedIn is implemented feel free "unskip" the suite and try the tests out
 */

describe.skip('AuthGuard', () => {

  it('should return true when AuthService isLoggedIn is true', () => {
    // Arrange
    TestBed.overrideProvider(AuthService, { useValue: { isLoggedIn: true } });
    const route = {} as ActivatedRouteSnapshot;
    const routerState = {} as RouterStateSnapshot;
    const expectedResult = true;
    // Act
    const result = TestBed.runInInjectionContext(() => authGuard(route, routerState));
    // Assert
    expect(result).toEqual(expectedResult);
  });

  it(`should return UrlTree['/login'] when not logged in`, () => {
    // Arrange
    TestBed.overrideProvider(AuthService, { useValue: { isLoggedIn: false } });
    const route = {} as ActivatedRouteSnapshot;
    const routerState = {} as RouterStateSnapshot;
    const expectedResult = TestBed.inject(Router).createUrlTree(['/login']);
    // Act
    const result = TestBed.runInInjectionContext(() => authGuard(route, routerState));
    // Assert
    expect(result).toEqual(expectedResult);
  });

});
