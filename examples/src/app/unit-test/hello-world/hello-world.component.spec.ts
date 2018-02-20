import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloWorldComponent } from './hello-world.component';
import { DebugElement } from '@angular/core';
import { User, UserService } from '../user.service';
import { By } from '@angular/platform-browser';
import { ExclamationPipe } from '../exclamation.pipe';

const userService = {
  user: {
    isLoggedIn: false,
    name: null,
  }
};

const router = {
  navigate: jasmine.createSpy('navigate')
};

describe('HelloWorldComponent', () => {
  let component: HelloWorldComponent;
  let fixture: ComponentFixture<HelloWorldComponent>;
  let debug: DebugElement;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelloWorldComponent, ExclamationPipe],
      providers: [
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloWorldComponent);
    component = fixture.componentInstance;
    debug = fixture.debugElement;
    element = debug.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should say hello stranger, when the user is not logged in', () => {
    expect(element.textContent).toContain('Welcome stranger');
  });

  it('should say hello Flemming Bregnvig, when Flemming is logged in', () => {
    const service: UserService = TestBed.get(UserService);
    service.user.isLoggedIn = true;
    service.user.name = 'Flemming Bregnvig';
    fixture.detectChanges();
    expect(element.textContent).toContain('Welcome Flemming Bregnvig');
    expect(element.textContent).not.toContain('Welcome stranger');
  });

  it('should navigate to the register page when the user clicks register', () => {
    const button = debug.query(By.css('button'));
    button.triggerEventHandler('click', null);
    const routerService: Router = TestBed.get(Router);
    expect(routerService.navigate).toHaveBeenCalledWith(['/register']);
  });
});
