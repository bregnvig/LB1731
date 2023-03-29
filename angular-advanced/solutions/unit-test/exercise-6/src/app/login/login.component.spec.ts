import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { firstValueFrom, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
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
    const email = 'email@email.com';
    const password = 'pword';
    const authService = TestBed.inject(AuthService);
    const authSpy = jest.spyOn(authService, 'login');
    component.fg.patchValue({ email, password });
    component.login();
    
    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(authSpy).toHaveBeenCalledWith(email, password);
  });

  it('should not login when form is invalid', () => {
    const email = `'asdåæf239j,.,.,.`;
    const password = 'pword';
    const authService = TestBed.inject(AuthService);
    const authSpy = jest.spyOn(authService, 'login');
    component.fg.patchValue({ email, password });
    component.login();
    
    expect(authSpy).toHaveBeenCalledTimes(0);
  });
  
  
  it('should navigate to root after successful login',() => {
    const email = `email@email.com`;
    const password = 'pword';
    const authService = TestBed.inject(AuthService)
    authService.login = (...args: any[]) => of(true);

    const router = TestBed.inject(Router);
    // We only fake navigate to avoid "Navigation triggered outside Angular zone" warning
    const routerSpy = jest.spyOn(router, 'navigate').mockImplementation(() => firstValueFrom(of(true))); 
    
    component.fg.patchValue({ email, password });
    component.login();

    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

});