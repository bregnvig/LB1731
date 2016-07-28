/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { StopwatchService } from './stopwatch.service';

describe('Service: Stopwatch', () => {
  beforeEach(() => {
    addProviders([StopwatchService]);
  });

  it('should ...',
    inject([StopwatchService],
      (service: StopwatchService) => {
        expect(service).toBeTruthy();
      }));
});
