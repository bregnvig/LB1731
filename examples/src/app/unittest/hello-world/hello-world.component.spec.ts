/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject, TestComponentBuilder } from '@angular/core/testing';
import { HelloWorldComponent } from './hello-world.component';



describe('Component: HelloWorld', () => {

  let component: HelloWorldComponent;
  let tcb: TestComponentBuilder;

  beforeEach(() => {
    addProviders([
      HelloWorldComponent,
      TestComponentBuilder
    ])
  });

  beforeEach(inject([HelloWorldComponent, TestComponentBuilder], (_component: HelloWorldComponent, _tcb: TestComponentBuilder) => {
    component = _component;
    tcb = _tcb;
  }));


  it('should create an instance', inject([HelloWorldComponent],
    (component: HelloWorldComponent) => {
      expect(component).not.toBeNull();
    })
  );
  it('should greet Hello World if input not set', done => {
      tcb.createAsync(HelloWorldComponent).then(fixture => {
        const greeter = fixture.componentInstance;
        const element = fixture.nativeElement;
        fixture.detectChanges(); //trigger change detection
        expect(element.querySelector('h1').innerText).toBe('Hello world!');
        done();
      })
  });
  it('shoulde output the input text', done => {
      tcb.createAsync(HelloWorldComponent).then(fixture => {
        const greeter: HelloWorldComponent = fixture.componentInstance;
        const element = fixture.nativeElement;
        greeter.greeting = 'Hello Flemming!';
        fixture.detectChanges(); //trigger change detection
        expect(element.querySelector('h1').innerText).toBe('Hello Flemming!');
        done();
      })
  });
})