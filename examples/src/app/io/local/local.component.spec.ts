/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { LocalComponent } from './local.component';

describe('Component: Local', () => {
  it('should create an instance', () => {
    let component = new LocalComponent();
    expect(component).toBeTruthy();
  });
});
