/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { SimpleHttpServiceComponent } from './simple-http-service.component';

describe('Component: SimpleHttpService', () => {
  it('should create an instance', () => {
    let component = new SimpleHttpServiceComponent();
    expect(component).toBeTruthy();
  });
});
