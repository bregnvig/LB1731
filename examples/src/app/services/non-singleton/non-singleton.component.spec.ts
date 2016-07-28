/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { NonSingletonComponent } from './non-singleton.component';

describe('Component: NonSingleton', () => {
  it('should create an instance', () => {
    let component = new NonSingletonComponent();
    expect(component).toBeTruthy();
  });
});
