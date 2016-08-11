/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { ChainingComponent } from './chaining.component';

describe('Component: Chaining', () => {
  it('should create an instance', () => {
    let component = new ChainingComponent();
    expect(component).toBeTruthy();
  });
});
