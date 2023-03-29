import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
// import { AuthService } from '../service/auth.service';

/**
 * Test suite below is skipped out because of missing AuthService to begin with. 
 * When AuthService is created and isLoggedIn is implemented feel free "unskip" the suite and try the tests out
 */

describe.skip('AuthGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ]
    });
  });

  it('should return true when AuthService isLoggedIn is true', () => {
    // const authService = TestBed.inject(AuthService);
    // const guard = TestBed.inject(AuthGuard);
    const authService = TestBed.inject<any>({} as any); // Remove this and enable above when AuthService implemented
    const authServiceIsLoggedInSpy = jest.spyOn(authService, 'isLoggedIn', 'get').mockReturnValue(true);
    const guard = TestBed.inject<any>({} as any);
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;
    expect(guard.canActivate(route, state)).toEqual(true);
    expect(authServiceIsLoggedInSpy).toHaveBeenCalledTimes(1);
  });
  
  it('should return true when AuthService isLoggedIn is true', () => {
    // const authService = TestBed.inject(AuthService);
    // const guard = TestBed.inject(AuthGuard);
    const authService = TestBed.inject<any>({} as any); // Remove this and enable above when AuthService implemented
    const authServiceIsLoggedInSpy = jest.spyOn(authService, 'isLoggedIn', 'get').mockReturnValue(false);
    const guard = TestBed.inject<any>({} as any);
    const router = TestBed.inject(Router);
    expect(guard.canActivate({} as any, {} as any)).toEqual(router.createUrlTree(['/login']));
    expect(authServiceIsLoggedInSpy).toHaveBeenCalledTimes(1);
  });

});

