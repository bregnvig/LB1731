/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { FakePlaygroundService } from '../app.component.spec';
import { DefaultDescriptionPipe, DistancePipe, HumanizeDistancePipe } from '../shared/pipes';

describe('Component: Sidebar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent,
        DefaultDescriptionPipe,
        DistancePipe,
        HumanizeDistancePipe
      ],
      providers: [FakePlaygroundService],
    });
  });
  
  it('should create an instance', () => {
    let component = TestBed.createComponent(SidebarComponent);
    expect(component).toBeTruthy();
  });
});
