import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from './auth.guard';

xdescribe('AuthGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ]
    });
  });

  it('should return true when AuthService isLoggedIn is true', () => {
    const authService = TestBed.inject(AuthService);
    const authServiceIsLoggedInSpy = jest.spyOn(authService, 'isLoggedIn', 'get').mockReturnValue(true);
    const guard = TestBed.inject(AuthGuard);
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;
    expect(guard.canActivate(route, state)).toEqual(true);
    expect(authServiceIsLoggedInSpy).toHaveBeenCalledTimes(1);
  });

  it('should return true when AuthService isLoggedIn is true', () => {
    const authService = TestBed.inject(AuthService);
    const authServiceIsLoggedInSpy = jest.spyOn(authService, 'isLoggedIn', 'get').mockReturnValue(false);
    const guard = TestBed.inject(AuthGuard);
    const router = TestBed.inject(Router);
    expect(guard.canActivate({} as any, {} as any)).toEqual(router.createUrlTree(['/login']));
    expect(authServiceIsLoggedInSpy).toHaveBeenCalledTimes(1);
  });

});
