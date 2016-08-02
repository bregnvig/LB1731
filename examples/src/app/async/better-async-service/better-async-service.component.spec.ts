/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { BetterAsyncServiceComponent } from './better-async-service.component';

describe('Component: BetterAsyncService', () => {
  it('should create an instance', () => {
    let component = new BetterAsyncServiceComponent();
    expect(component).toBeTruthy();
  });
});
