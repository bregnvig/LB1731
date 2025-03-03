import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('outside', { static: true }) div!: ElementRef<HTMLDivElement>;
  no: No = { value: 0 };

  constructor(private zone: NgZone) {
    super();
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => this.div.nativeElement.addEventListener('mousemove', event => this.mouseMove(event)));
  }

  mouseMove(event: MouseEvent) {
    console.log('Mouse move', event);
  }

  startCounter() {
    timer(0, 1000).pipe(this.takeUntilDestroyed()).subscribe(no => this.no.value = no);
  }
}
