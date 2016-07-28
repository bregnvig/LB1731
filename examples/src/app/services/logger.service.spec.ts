/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('Service: Logger', () => {
  beforeEach(() => {
    addProviders([LoggerService]);
  });

  it('should ...',
    inject([LoggerService],
      (service: LoggerService) => {
        expect(service).toBeTruthy();
      }));
});
