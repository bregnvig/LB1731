import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Playground, PlaygroundService } from 'src/app/shared';

@Component({
    selector: 'loop-life-cycle',
    templateUrl: './life-cycle.component.html',
    styleUrls: ['./life-cycle.component.scss'],
    standalone: false
})
export class LifeCycleComponent implements OnInit {

  playgrounds?: Playground[];

  constructor(private service: PlaygroundService) {
    service.playgrounds$.pipe(
      takeUntilDestroyed()
    ).subscribe(playgrounds => this.playgrounds = playgrounds);
  }

  ngOnInit(): void {
    // this.service.playgrounds$.pipe(
    //   takeUntilDestroyed()
    // ).subscribe(playgrounds => this.playgrounds = playgrounds);
  }
}
