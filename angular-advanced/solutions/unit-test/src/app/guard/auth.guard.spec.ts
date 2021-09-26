import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from './auth.guard';


describe('AuthGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ]
    });
  });

  it('should return true when AuthService isLoggedIn is true', () => {
    TestBed.overrideProvider(AuthService, { useValue: { isLoggedIn: true } }); // <= Stub
    const guard = TestBed.inject(AuthGuard);
    expect(guard.canActivate({} as any, {} as any)).toEqual(true);
  });

  it('should return true when AuthService isLoggedIn is true', () => {
    TestBed.overrideProvider(AuthService, { useValue: { isLoggedIn: false } }); // <= Stub
    const guard = TestBed.inject(AuthGuard);
    const router = TestBed.inject(Router);
    expect(guard.canActivate({} as any, {} as any)).toEqual(router.createUrlTree(['/login']));
  });

});
