/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { PlaygroundService } from './playground.service';

describe('Service: Playground', () => {
  beforeEach(() => {
    addProviders([PlaygroundService]);
  });

  it('should ...',
    inject([PlaygroundService],
      (service: PlaygroundService) => {
        expect(service).toBeTruthy();
      }));
});
