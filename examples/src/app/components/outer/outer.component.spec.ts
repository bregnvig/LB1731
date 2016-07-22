/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { OuterComponent } from './outer.component';

describe('Component: Outer', () => {
  it('should create an instance', () => {
    let component = new OuterComponent();
    expect(component).toBeTruthy();
  });
});
