/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { DirectlyComponent } from './directly.component';

describe('Component: Directly', () => {
  it('should create an instance', () => {
    let component = new DirectlyComponent();
    expect(component).toBeTruthy();
  });
});
