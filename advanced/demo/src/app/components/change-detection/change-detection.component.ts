import { Component, ElementRef, NgZone, OnInit, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { timer } from 'rxjs';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';
import { InputPropertyComponent } from './input-property/input-property.component';
import { InputPropertyOnPushByReferenceComponent } from './input-property/input-property-on-push-by-reference.component';
import { InputPropertyOnPushSimpleTypeComponent } from './input-property/input-property-on-push-simple-type.component';
import { ObservableEventsComponent } from './observable-events/observable-events.component';
import { ObservableEventsDefaultComponent } from './observable-events/observable-events-default.component';
import { WrappedInsideOnPushComponent } from './observable-events/wrapped-inside-onpush.component';

export interface No {
  value: number;
}

@Component({
  selector: 'loop-change-detection',
  templateUrl: './change-detection.component.html',
  styleUrls: ['./change-detection.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InputPropertyComponent, InputPropertyOnPushByReferenceComponent, InputPropertyOnPushSimpleTypeComponent, ObservableEventsComponent, ObservableEventsDefaultComponent, WrappedInsideOnPushComponent]
})
export class ChangeDetectionComponent extends AbstractSubscribeUnsubscribeDirective implements OnInit {

  div = viewChild.required<ElementRef<HTMLDivElement>>('outside');
  no: No = { value: 0 };

  constructor(private zone: NgZone) {
    super();
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => this.div().nativeElement.addEventListener('mousemove', event => this.mouseMove(event)));
  }

  mouseMove(event: MouseEvent) {
    console.log('Mouse move', event);
  }

  startCounter() {
    timer(0, 1000).pipe(this.takeUntilDestroyed()).subscribe(x => this.no.value = x);
  }
}
