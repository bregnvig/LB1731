/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlaygroundService } from './playground.service';

describe('Service: Playground', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaygroundService] 
    });
  });

  it('should ...',
    inject([PlaygroundService],
      (service: PlaygroundService) => {
        expect(service).toBeTruthy();
      }));
});
