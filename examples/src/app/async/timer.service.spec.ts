/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { TimerService } from './timer.service';

describe('Service: Timer', () => {
  beforeEach(() => {
    addProviders([TimerService]);
  });

  it('should ...',
    inject([TimerService],
      (service: TimerService) => {
        expect(service).toBeTruthy();
      }));
});
