import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Playground } from '../model/playground';
import { PlaygroundService } from './playground.service';

const havnegade: Playground = {
  id: 'legeplads.1',
  name: 'Havnegades trampolinpromenade',
  description: 'Hop i trampolin med havnekig.',
  addressDescription: 'Havnegade',
  position: { lat: 55.6767238736979, lng: 12.589685450548627 },
};

const panterensBastion: Playground = {
  id: 'legeplads.2',
  name: 'Legepladsen på Christianshavns Vold - Panterens Bastion',
  description: 'Fredelig, grøn plet til leg og grill.',
  addressDescription: 'på Panterens Bastion',
  position: { lat: 55.669599877562, lng: 12.588571683898572 },
};

describe('PlaygroundService', () => {
  let service: PlaygroundService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(PlaygroundService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should return only the playgrounds whose name contains the query', async () => {
    // Arrange
    const result = firstValueFrom(service.search('christianshavn'));
    // Act
    httpTesting.expectOne('assets/copenhagen.json').flush([havnegade, panterensBastion]);
    // Assert
    expect(await result).toEqual([panterensBastion]);
  });

  it('should return an empty list when no name matches', async () => {
    // Arrange
    const result = firstValueFrom(service.search('århus'));
    // Act
    httpTesting.expectOne('assets/copenhagen.json').flush([havnegade, panterensBastion]);
    // Assert
    expect(await result).toEqual([]);
  });

  it('should reject when the server fails', async () => {
    // Arrange
    const result = firstValueFrom(service.search('christianshavn'));
    // Act
    httpTesting.expectOne('assets/copenhagen.json').flush('Server error', { status: 500, statusText: 'Internal Server Error' });
    // Assert
    await expect(result).rejects.toMatchObject({ status: 500 });
  });

});
