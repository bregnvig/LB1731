import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[dynamicHost]',
    standalone: false
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}