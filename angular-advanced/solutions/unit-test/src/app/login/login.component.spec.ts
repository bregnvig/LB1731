import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('calls login with email & password from form', () => {
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

  it('will not call login when form is invalid', () => {
    // The setup
    const email = `'asdåæf239j,.,.,.`;
    const password = '';
    const authService = TestBed.inject(AuthService);
    const authSpy = jest.spyOn(authService, 'login');
    component.fg.patchValue({ email, password });
    component.login();
    
    // The Expect
    expect(authSpy).toHaveBeenCalledTimes(0);
  });

});
