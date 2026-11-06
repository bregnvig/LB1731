import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('creates the app shell', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });
});
