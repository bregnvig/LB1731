import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Playground } from '../model/playground';
import { PlaygroundSearchComponent } from './playground-search.component';

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

describe('PlaygroundSearchComponent', () => {
  let fixture: ComponentFixture<PlaygroundSearchComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    // Arrange
    fixture = TestBed.createComponent(PlaygroundSearchComponent);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('playgrounds', [havnegade, panterensBastion]);
    await fixture.whenStable();
  });

  async function search(query: string): Promise<void> {
    const field = element.querySelector('input')!;
    // Act
    field.value = query;
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  it('should only list the playgrounds whose name contains the query', async () => {
    // Act
    await search('trampolin');
    // Assert
    const list = element.querySelector('ul')!.textContent;
    expect(list).toContain('Havnegades trampolinpromenade');
    expect(list).not.toContain('Christianshavn');
  });

  it(`should show 'Ingen legepladser' when no name matches`, async () => {
    // Act
    await search('århus');
    // Assert
    expect(element.querySelector('ul')!.textContent).toContain('Ingen legepladser');
  });

});
