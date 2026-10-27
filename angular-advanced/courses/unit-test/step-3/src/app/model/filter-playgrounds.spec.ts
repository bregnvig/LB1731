import { describe, it, expect } from 'vitest';
import { filterPlaygrounds } from './filter-playgrounds';
import { Playground } from './playground';

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

describe('filterPlaygrounds', () => {

  it('should return the playgrounds whose name contains the query, ignoring case', () => {
    // Arrange
    const playgrounds = [havnegade, panterensBastion];
    // Act
    const result = filterPlaygrounds(playgrounds, 'CHRISTIANSHAVN');
    // Assert
    expect(result).toEqual([panterensBastion]);
  });

  it('should return an empty list when no name matches', () => {
    // Arrange
    const playgrounds = [havnegade, panterensBastion];
    // Act
    const result = filterPlaygrounds(playgrounds, 'århus');
    // Assert
    expect(result).toEqual([]);
  });

});
