import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { LoginComponent, LoginModule } from './login.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should login with email & password from form', () => {
    // The setup
    const email = 'email@email.com';
    const password = 'pword';
    const authService = TestBed.inject(AuthService);
    const authSpy = jest.spyOn(authService, 'login');
    component.fg.patchValue({ email, password });
    component.login();

    // The Expect
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith(email, password);
  });

  it('should not login when form is invalid', () => {
    // The setup
    const email = `'asdåæf239j,.,.,.`;
    const password = 'pword';
    const authService = TestBed.inject(AuthService);
    const authSpy = jest.spyOn(authService, 'login');
    component.fg.patchValue({ email, password });
    component.login();

    // The Expect
    expect(authSpy).toHaveBeenCalledTimes(0);
  });

  it('should change the route after successful login',() => {
    // The setup
    const email = `email@email.com`;
    const password = 'pword';
    const authService = TestBed.inject(AuthService)
    authService.login = (...args: any[]) => of(true);

    const router = TestBed.inject(Router);
    const routerSpy = jest.spyOn(router, 'navigate');
    component.fg.patchValue({ email, password });
    component.login();

    // The Expect
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

});
