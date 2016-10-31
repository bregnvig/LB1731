/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, inject } from '@angular/core/testing';
import { HelloComponent } from './hello.component';

describe('Component: Hello', () => {
  it('should create an instance', () => {
    let component = new HelloComponent();
    expect(component).toBeTruthy();
  });
});
