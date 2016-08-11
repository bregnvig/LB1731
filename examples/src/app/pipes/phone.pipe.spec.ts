/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { PhonePipe } from './phone.pipe';

describe('Pipe: Phone', () => {
  it('create an instance', () => {
    let pipe = new PhonePipe();
    expect(pipe).toBeTruthy();
  });
});
