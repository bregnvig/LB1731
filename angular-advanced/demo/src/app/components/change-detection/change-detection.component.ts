import { Component, ElementRef, NgZone, OnInit, viewChild } from '@angular/core';
import { timer } from 'rxjs';
import { AbstractSubscribeUnsubscribeDirective } from 'src/app/rxjs/rxjs-utils';

export interface No {
  value: number;
}

@Component({
  selector: 'loop-change-detection',
  templateUrl: './change-detection.component.html',
  styleUrls: ['./change-detection.component.scss'],
  standalone: false
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
