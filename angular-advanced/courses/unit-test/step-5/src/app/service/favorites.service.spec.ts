import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    service = TestBed.inject(FavoritesService);
  });

  it('should add a playground to the favorites when toggled', () => {
    // Act
    service.toggle('legeplads.2');
    // Assert
    expect(service.favoriteIds()).toEqual(['legeplads.2']);
  });

  it('should remove a playground from the favorites when toggled again', () => {
    // Arrange
    service.toggle('legeplads.2');
    // Act
    service.toggle('legeplads.2');
    // Assert
    expect(service.favoriteIds()).toEqual([]);
  });

  it('should keep both playgrounds when two are toggled', () => {
    // Arrange
    service.toggle('legeplads.1');
    // Act
    service.toggle('legeplads.2');
    // Assert
    expect(service.favoriteIds()).toEqual(['legeplads.1', 'legeplads.2']);
  });

});
