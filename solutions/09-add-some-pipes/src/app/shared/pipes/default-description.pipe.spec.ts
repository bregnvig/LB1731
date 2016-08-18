/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { DefaultDescriptionPipe } from './default-description.pipe';

describe('Pipe: DefaultDescription', () => {
  it('create an instance', () => {
    let pipe = new DefaultDescriptionPipe();
    expect(pipe).toBeTruthy();
  });
});
