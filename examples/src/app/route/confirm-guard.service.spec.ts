/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { ConfirmGuardService } from './confirm-guard.service';

describe('Service: ConfirmService', () => {
  beforeEach(() => {
    addProviders([ConfirmGuardService]);
  });

  it('should ...',
    inject([ConfirmGuardService],
      (service: ConfirmGuardService) => {
        expect(service).toBeTruthy();
      }));
});
