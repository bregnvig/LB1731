import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PlaygroundService } from 'src/app/shared';
import { PopoverService } from './popover.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgComponentOutlet } from '@angular/common';
import { ComponentOutletInjectorDirective } from 'ng-dynamic-component';

@Component({
  selector: 'loop-dynamic-component',
  template: `
    <section class="demo-surface">
      <p class="mechanism"><code>*ngComponentOutlet="popover; inputs:&#123;playground&#125;"</code></p>
      <div class="list-group list-group-action">
        @for (playground of playgrounds(); track playground.id) {
          <button 
            class="list-group-item list-group-item-action">
            <span container="body" [ngbPopover]="popoverContent">{{playground.name}}</span>
            <ng-template #popoverContent>
              <ng-container *ngComponentOutlet="popover; inputs:{playground}" />
            </ng-template>
        </button>
        }
      </div>
    </section>
  `,
  styles: `@import "src/app/components/dynamic-component/launcher";`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbPopover, NgComponentOutlet, ComponentOutletInjectorDirective]
})
export class DynamicComponentComponent {

  playgrounds = toSignal(inject(PlaygroundService).playgrounds$);
  popover = inject(PopoverService).popoverComponent;
}
