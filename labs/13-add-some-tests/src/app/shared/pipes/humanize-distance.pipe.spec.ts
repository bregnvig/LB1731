/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { HumanizeDistancePipe } from './humanize-distance.pipe';

describe('Pipe: HumanizeDistance', () => {
  it('create an instance', () => {
    let pipe = new HumanizeDistancePipe();
    expect(pipe).toBeTruthy();
  });
});
