/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TestBed, async, inject } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { FakePlaygroundService } from '../app.component.spec';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from '../shared/pipes';
import { MapComponent } from '../map';
import { FooterComponent } from '../footer';
import { LeafletModule } from '../leaflet';

const fake = {
    provide: ActivatedRoute,
    useValue: {}
  };


describe('Component: Sidebar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LeafletModule, RouterModule],
      declarations: [
        SidebarComponent,
        MapComponent,
        FooterComponent,
        DefaultDescriptionPipe,
        DistancePipe,
        HumanizeDistancePipe,
      ],
      providers: [FakePlaygroundService, fake],
    });
  });
  
  it('should create an instance', () => {
    let component = TestBed.createComponent(SidebarComponent);
    expect(component).toBeTruthy();
  });
});
