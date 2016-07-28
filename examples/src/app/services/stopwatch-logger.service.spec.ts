/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { StopwatchLoggerService } from './stopwatch-logger.service';

describe('Service: StopwatchLogger', () => {
  beforeEach(() => {
    addProviders([StopwatchLoggerService]);
  });

  it('should ...',
    inject([StopwatchLoggerService],
      (service: StopwatchLoggerService) => {
        expect(service).toBeTruthy();
      }));
});
