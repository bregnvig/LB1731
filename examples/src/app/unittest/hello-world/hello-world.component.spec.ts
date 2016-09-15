/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { HelloWorldComponent } from './hello-world.component';

describe('Component: HelloWorld', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [HelloWorldComponent],
    });
  });

  it('should create an instance', () => {
    let component = TestBed.createComponent(HelloWorldComponent);
    expect(component).toBeTruthy();
  });

  it(`should have as greet 'Hello world!'`, async(() => {
    let fixture = TestBed.createComponent(HelloWorldComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.greet).toEqual('Hello world!');
  }));

  it('should render greet in a p tag', async(() => {
    let fixture = TestBed.createComponent(HelloWorldComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Hello world!');
  }));

  it('should render changedgreet in a p tag', async(() => {
    let fixture = TestBed.createComponent(HelloWorldComponent);
    fixture.debugElement.componentInstance.greet = 'Hello Flemming';
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Hello Flemming');
  }));

});
