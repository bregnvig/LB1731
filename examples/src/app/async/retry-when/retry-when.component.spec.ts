/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RetryWhenComponent } from './retry-when.component';

describe('RetryWhenComponent', () => {
  let component: RetryWhenComponent;
  let fixture: ComponentFixture<RetryWhenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetryWhenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetryWhenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
