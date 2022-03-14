import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { Playground } from 'src/app/shared';
import { DynamicHostDirective } from '../dynamic-host.directive';
import { PopoverService } from '../popover.service';
import { SimplePlaygroundDetailsComponent } from '../simple-playground-details/simple-playground-details.component';

@Component({
  selector: 'loop-popover-content',
  template: `
    <ng-template dynamicHost></ng-template>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverContentComponent {

  @ViewChild(DynamicHostDirective, { static: true }) host!: DynamicHostDirective;

  constructor(
    private popoverService: PopoverService,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  @Input()
  set playground(value: Playground) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.popoverService.popoverComponent);
    const viewContainerRef = this.host.viewContainerRef;
    // viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<SimplePlaygroundDetailsComponent>(componentFactory);
    // const componentRef = viewContainerRef.createComponent<SimplePlaygroundDetailsComponent>(this.popoverService.popoverComponent);
    componentRef.instance.playground = value;
  }
}
