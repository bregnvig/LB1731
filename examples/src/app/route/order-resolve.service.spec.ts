/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { OrderResolveService } from './order-resolve.service';

describe('Service: OrderResolve', () => {
  beforeEach(() => {
    addProviders([OrderResolveService]);
  });

  it('should ...',
    inject([OrderResolveService],
      (service: OrderResolveService) => {
        expect(service).toBeTruthy();
      }));
});
