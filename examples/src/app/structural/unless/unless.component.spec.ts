/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { UnlessComponent } from './unless.component';

describe('Component: Unless', () => {
  it('should create an instance', () => {
    let component = new UnlessComponent();
    expect(component).toBeTruthy();
  });
});
