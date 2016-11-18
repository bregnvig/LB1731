/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RetryService } from './retry.service';

describe('RetryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetryService]
    });
  });

  it('should ...', inject([RetryService], (service: RetryService) => {
    expect(service).toBeTruthy();
  }));
});
