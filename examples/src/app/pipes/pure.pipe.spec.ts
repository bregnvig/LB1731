/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { PurePipe } from './pure.pipe';

describe('Pipe: Pure', () => {
  it('create an instance', () => {
    let pipe = new PurePipe();
    expect(pipe).toBeTruthy();
  });
});
