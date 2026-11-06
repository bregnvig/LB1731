import { describe, it, expect } from 'vitest';
import { DefaultDescriptionPipe } from './default-description.pipe';

describe('DefaultDescriptionPipe', () => {

  it(`should fall back to 'Ingen beskrivelse' when there is no description`, () => {
    // Arrange
    const pipe = new DefaultDescriptionPipe();
    // Act
    const result = pipe.transform(undefined);
    // Assert
    expect(result).toBe('Ingen beskrivelse');
  });

});
