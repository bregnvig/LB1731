/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { PlaygroundService } from '../shared/playground.service';

describe('Component: Sidebar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent
      ],
      providers: [PlaygroundService],
    });
  });
  
  it('should create an instance', () => {
    let component = TestBed.createComponent(SidebarComponent);
    expect(component).toBeTruthy();
  });
});
