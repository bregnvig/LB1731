/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, inject } from '@angular/core/testing';
import { InnerComponent } from './inner.component';

describe('Component: Inner', () => {
  it('should create an instance', () => {
    let component = new InnerComponent();
    expect(component).toBeTruthy();
  });
});
