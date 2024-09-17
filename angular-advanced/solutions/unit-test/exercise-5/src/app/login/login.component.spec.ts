import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should login with email & password from form', () => {
    // Arrange
    const email = 'email@email.com';
    const password = 'pword';
    const authService = TestBed.inject(AuthService);
    const authSpy = jest.spyOn(authService, 'login');

    // Act
    component.fg.patchValue({ email, password });
    component.login();

    // Assert
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith(email, password);
  });

  
  it('should not login when form is invalid', () => {
    // Arrange
    const email = `'asdåæf239j,.,.,.`;
    const password = 'pword';
    const authService = TestBed.inject(AuthService);
    const authSpy = jest.spyOn(authService, 'login');

    // Act
    component.fg.patchValue({ email, password });
    
    // Assert
    expect(() => component.login()).toThrow();
    expect(authSpy).toHaveBeenCalledTimes(0);
  });
  
  
  it('should navigate to root after successful login',() => {
    // Arrange
    const email = `email@email.com`;
    const password = 'pword';
    const authService = TestBed.inject(AuthService)
    authService.login = (...args: any[]) => of(true);

    const router = TestBed.inject(Router);
    // We only fake navigate to avoid "Navigation triggered outside Angular zone" warning
    const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => firstValueFrom(of(true))); 
    
    // Act
    component.fg.patchValue({ email, password });
    component.login();

    // Assert
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

});
